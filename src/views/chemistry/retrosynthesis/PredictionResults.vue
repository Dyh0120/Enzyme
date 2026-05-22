<template>
  <div class="results-page">
    <el-card shadow="none" class="results-table-card">
      <el-table :data="predictionBatches" border stripe v-loading="loading" table-layout="fixed">
        <el-table-column label="目标 SMILES" min-width="180">
          <template #default="{ row }">
            <el-tooltip :content="row.target_smiles" placement="top">
              <span class="smiles-text">{{ row.target_smiles }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="3D 预览 (双击放大)" width="200">
          <template #default="{ row }">
            <div class="structure-wrapper" v-loading="imgLoading[row.task_id]" @dblclick="openModal(row)">
              <MoleculeViewer 
                v-show="structureData[row.task_id]"
                :sdf-data="structureData[row.task_id]"
                :id="'viewer-' + row.task_id"
              />
              <div v-if="imgLoading[row.task_id]" class="loading-overlay">
                <el-spinner size="large" />
              </div>
              <div v-else-if="!structureData[row.task_id]" class="no-data">暂无预览</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="状态/统计" width="160">
          <template #default="{ row }">
            <div class="stats-cell">
              <el-tag :type="row.processed ? 'success' : 'warning'" size="small">
                <el-icon v-if="!row.processed && row.pid !== 0" class="is-loading"><ele-Loading /></el-icon>
                {{ row.processed ? '计算完成' : (row.pid !== 0 ? '计算中...' : '等待开始') }}
              </el-tag>
              <span class="stats-info">⏱️ {{ row.duration ? row.duration.toFixed(2) + 's' : '-' }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="create_time" label="创建时间" width="170" />

        <el-table-column label="操作" width="350" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button 
                v-if="!row.processed && row.pid === 0"
                type="primary" 
                link 
                :loading="buttonLoading[row.task_id]"
                @click="handleStart(row)"
              >开始预测</el-button>

              <el-button type="info" link @click="handleViewLogs(row)">查看日志</el-button>

              <el-button type="success" link @click="openRouteModal(row)" :disabled="!row.processed">查看路径</el-button>
              
              <template v-if="row.processed">
                <el-dropdown v-if="getPdfFiles(row).length > 1" trigger="click">
                  <el-button type="primary" link>查看搜索树 <el-icon class="el-icon--right"><ele-ArrowDown /></el-icon></el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item v-for="(file, idx) in getPdfFiles(row)" :key="idx" @click="viewFile(file)">
                        搜索树 {{ idx + 1 }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <el-button 
                  v-else-if="getPdfFiles(row).length === 1"
                  type="primary" 
                  link 
                  @click="viewFile(getPdfFiles(row)[0])"
                >查看搜索树</el-button>
              </template>

              <el-popconfirm title="确认删除任务？" @confirm="handleDelete(row)">
                <template #reference>
                  <el-button type="danger" link>删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
			<div class="results-pagination">
  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :page-sizes="[10, 20, 50, 100]"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handlePageChange"
  />
</div>

    </el-card>

<el-dialog v-model="routeModalVisible" title="逆合成路径详情" width="1200px" destroy-on-close align-center class="route-custom-dialog">
  <el-row :gutter="30" class="route-layout-container">
    <el-col :span="12" class="route-left-panel">
      <div class="panel-header">逆合成具体路径 - 共 {{ currentRoutesData.length }} 条</div>
      <div class="route-modal-content">
        <div v-if="currentRoutesData.length > 0" class="routes-list">
          <div v-for="(route, rIdx) in currentRoutesData" :key="rIdx" class="route-item-container">
            <div class="route-item-header">路径 {{ rIdx + 1 }} 详情</div>
            <div class="vertical-route">
              <div v-for="(step, index) in route" :key="index">
                <div v-if="step.type" class="step-arrow-down">
                  <div class="reaction-tag">
                    <el-tag size="small" type="warning" effect="dark">{{ step.type }}</el-tag>
                  </div>
                  <el-icon><ele-Bottom /></el-icon>
                </div>

                <div class="molecules-row">
                  <div v-for="(smiles, sIdx) in step.molecules" :key="sIdx" class="step-node">
                    <div class="step-header">
                      <span class="step-index">
                        分子 {{ step.molecules.length > 1 ? `${index + 1}-${+sIdx + 1}` : (index + 1) }}
                      </span>
                      <el-button size="small" link @click="copyText(smiles)">复制 SMILES</el-button>
                    </div>
                    <div class="step-body">
                      <div class="step-viewer-box">
                        <MoleculeViewer 
                          v-if="routeSdfData[smiles]" 
                          :sdf-data="routeSdfData[smiles]" 
                          :id="'route-viewer-' + rIdx + '-' + index + '-' + sIdx"
                        />
                        <div v-else class="mini-loading">载入中...</div>
                      </div>
                      <div class="step-smiles">{{ smiles }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-empty v-else description="无路径数据" />
      </div>
    </el-col>
    
    <el-col :span="12" class="route-image-panel">
      <div class="panel-header">路线总览图 (PNG) - 共 {{ currentRouteImgs.length }} 条路径</div>
      <div class="image-scroll-box">
         <div v-if="currentRouteImgs.length > 0" class="image-list">
            <div v-for="(img, idx) in currentRouteImgs" :key="idx" class="image-item">
              <div class="image-label">路径 {{ idx + 1 }}</div>
              <el-image 
                :src="img" 
                fit="scale-down" 
                :preview-src-list="currentRouteImgs"
                :initial-index="idx"
                class="route-png"
              >
                <template #error><div class="img-error">加载失败</div></template>
              </el-image>
            </div>
         </div>
         <el-empty v-else description="路线图加载中..." />
      </div>
    </el-col>
  </el-row>
</el-dialog>

    <el-dialog v-model="modalVisible" title="分子 3D 结构详情" width="800px" destroy-on-close align-center>
      <div class="modal-viewer-wrapper">
        <MoleculeViewer v-if="currentModalSdf" :sdf-data="currentModalSdf" id="viewer-modal" is-large />
      </div>
    </el-dialog>

    <el-dialog v-model="logsModalVisible" title="任务日志" width="800px" destroy-on-close align-center>
      <div v-loading="logsLoading" class="logs-container">
        <pre v-if="currentLogs">{{ currentLogs }}</pre>
        <el-empty v-else description="暂无日志数据" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineComponent, h, watch, nextTick, onBeforeUnmount } from 'vue';
import { getTaskList, drawTask, startProcess, shutdownProcess, getTaskLogs, deleteTask } from './api';
import { Local } from '/@/utils/storage';
import { ElMessage } from 'element-plus';

/* =========================
    全局3Dmol加载（只加载一次）
========================= */
let loading3Dmol: Promise<any> | null = null;

const load3Dmol = () => {
  if ((window as any).$3Dmol) return Promise.resolve((window as any).$3Dmol);

  if (!loading3Dmol) {
    loading3Dmol = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.0.4/3Dmol-min.js';
      script.onload = () => resolve((window as any).$3Dmol);
      document.head.appendChild(script);
    });
  }

  return loading3Dmol;
};

/* =========================
   等待DOM尺寸稳定（核心）
========================= */
const waitForElementReady = (el: HTMLElement) => {
  return new Promise<void>((resolve) => {
    const check = () => {
      if (el.offsetWidth > 50 && el.offsetHeight > 50) resolve();
      else requestAnimationFrame(check);
    };
    check();
  });
};

/* =========================
  3D Viewer组件（稳定版）
========================= */
const MoleculeViewer = defineComponent({
  props: { sdfData: String, id: String, isLarge: Boolean },
  setup(props) {
    const viewerRef = ref<HTMLElement | null>(null);
    let viewer: any = null;
    let resizeObserver: ResizeObserver | null = null;
    let intersectObserver: IntersectionObserver | null = null;
    let destroyed = false;

    const renderMolecule = async () => {
      if (!props.sdfData || !viewerRef.value || destroyed) return;

      const el = viewerRef.value;
      await waitForElementReady(el);

      const $3Dmol = await load3Dmol();
      if (!el || destroyed) return;

      // 策略：进入视野才创建并渲染，离开视野立即销毁释放上下文
      if (!intersectObserver) {
        intersectObserver = new IntersectionObserver(async (entries) => {
          const entry = entries[0];
          
          if (entry.isIntersecting && !destroyed) {
            // 1. 进入视野：创建或恢复 viewer
            if (!viewer) {
              try {
                viewer = $3Dmol.createViewer(el, { backgroundColor: 'white' });
                
                if (!resizeObserver) {
                  resizeObserver = new ResizeObserver(() => {
                    if (viewer && !destroyed) {
                      viewer.resize();
                      viewer.render();
                    }
                  });
                  resizeObserver.observe(el);
                }
              } catch (e) {
                console.error('Failed to create 3Dmol viewer:', e);
                return;
              }
            }

            // 2. 加载数据并渲染
            if (viewer && props.sdfData) {
              viewer.clear();
              viewer.addModel(props.sdfData, 'sdf');
              viewer.setStyle({}, {
                stick: { radius: 0.15, colorscheme: 'Jmol' },
                sphere: { scale: 0.25, colorscheme: 'Jmol' }
              });
              viewer.zoomTo();
              viewer.render();
            }
          } else {
            // 3. 离开视野：立即销毁释放 WebGL 上下文，防止累积变白
            if (viewer) {
              viewer.clear();
              // 注意：3Dmol 没有显式的 destroy，设置为 null 并清除 DOM 是释放上下文的最佳方式
              const canvas = el.querySelector('canvas');
              if (canvas) canvas.remove();
              viewer = null;
            }
          }
        }, { 
          threshold: 0.01,
          rootMargin: '200px' // 提前 200px 加载，减少白块感
        });
        intersectObserver.observe(el);
      }
    };

    /* ===== 生命周期 ===== */
    onMounted(async () => {
      await nextTick();
      renderMolecule();
    });

    watch(() => props.sdfData, async () => {
      await nextTick();
      renderMolecule();
    });

    onBeforeUnmount(() => {
      destroyed = true;

      if (resizeObserver) resizeObserver.disconnect();
      if (intersectObserver) intersectObserver.disconnect();

      if (viewer) {
        viewer.clear();
        viewer = null;
      }
    });

    return () =>
      h('div', {
        ref: viewerRef,
        id: props.id,
        class: 'molecule-canvas-container',
        style: {
          width: '100%',
          height: '100%',
          minHeight: props.isLarge ? '400px' : '100px',
          position: 'relative',
          background: '#fcfcfc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, [
        // 当 viewer 还没创建时显示个轻量占位
        !viewer ? h('div', { 
          style: { color: '#ccc', fontSize: '10px' } 
        }, '3D 结构载入中...') : null
      ]);
  }
});

/* =========================
    数据逻辑
========================= */
const predictionBatches = ref<any[]>([]);
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);
const loading = ref(false);

const structureData = ref<Record<string, string>>({});
const imgLoading = ref<Record<string, boolean>>({});

const modalVisible = ref(false);
const currentModalSdf = ref('');

const routeModalVisible = ref(false);
const currentRouteImgs = ref<string[]>([]);
const currentRoutesData = ref<any[][]>([]);
const routeSdfData = ref<Record<string, string>>({});

const logsModalVisible = ref(false);
const currentLogs = ref('');
const logsLoading = ref(false);
const buttonLoading = ref<Record<string, boolean>>({});
let pollingTimer: any = null;

/* =========================
    获取任务列表
========================= */
const fetchData = async (isPolling = false) => {
  if (!isPolling) loading.value = true;

  try {
    const userId = parseInt(Local.get('userId') || '100');
    const res = await getTaskList({
      page: currentPage.value,
      pagesize: pageSize.value,
      id: userId
    });

    if (res.code === 200) {
      predictionBatches.value = res.data.list.filter((item: any) => item.is_del === 0);
      total.value = res.data.total;

      await loadStructures(predictionBatches.value);

      //  如果有正在处理的任务，开启轮询
      const hasProcessing = predictionBatches.value.some(item => !item.processed && item.pid !== 0);
      if (hasProcessing) {
        startPolling();
      } else {
        stopPolling();
      }

      //  强制刷新一次布局（关键）
      await nextTick();
      window.dispatchEvent(new Event('resize'));
    }
  } catch (error) {
    if (!isPolling) ElMessage.error('获取列表失败');
  } finally {
    if (!isPolling) loading.value = false;
  }
};

const startPolling = () => {
  if (pollingTimer) return;
  pollingTimer = setInterval(() => {
    fetchData(true);
  }, 5000); // 每5秒刷新一次
};

const stopPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
};

/* =========================
    加载3D结构（防重复+并发安全）
========================= */
const loadingSet = new Set<string>();

const loadStructures = async (list: any[]) => {
  const tasks = list.map(async (item) => {
    if (!item.target_smiles) return;

    if (structureData.value[item.task_id]) return;
    if (loadingSet.has(item.task_id)) return;

    loadingSet.add(item.task_id);
    imgLoading.value[item.task_id] = true;

    try {
      const res = await drawTask({ smiles: item.target_smiles });
      if (res.code === 200) {
        structureData.value[item.task_id] = res.data;
      }
    } catch (e) {
      console.error(e);
    } finally {
      imgLoading.value[item.task_id] = false;
      loadingSet.delete(item.task_id);
    }
  });

  await Promise.all(tasks);
};

/* =========================
    路径弹窗
========================= */
const parseRouteToSteps = (routeObj: any) => {
  if (!routeObj || !routeObj.molecules) return [];
  
  const { molecules, children, template_types } = routeObj;
  const pathSteps: any[] = [];

  pathSteps.push({ molecules: [molecules[0]], type: null });

  let currentIndex = 0;
  // 提取路径步骤
  while (children[currentIndex]?.length > 0) {
    const childIndices = children[currentIndex];
    const type = template_types[currentIndex];

    pathSteps.push({
      molecules: childIndices.map((i: number) => molecules[i]),
      type
    });

    const next = childIndices.find((i: number) => children[i]?.length > 0);
    if (next === undefined) break;
    currentIndex = next;
  }
  return pathSteps;
};

const parseLooseJson = (text: string) => {
  if (!text || typeof text !== 'string') return null;
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch (_) {
    let normalized = trimmed;
    normalized = normalized.replace(/(^|[\s,:\[\{])None(?=([\s,\}\]]|$))/g, '$1null');
    normalized = normalized.replace(/(^|[\s,:\[\{])True(?=([\s,\}\]]|$))/g, '$1true');
    normalized = normalized.replace(/(^|[\s,:\[\{])False(?=([\s,\}\]]|$))/g, '$1false');
    normalized = normalized.replace(/'/g, '"');
    normalized = normalized.replace(/,\s*([\}\]])/g, '$1');
    try {
      return JSON.parse(normalized);
    } catch (e2) {
      try {
        return new Function(`return (${normalized})`)();
      } catch {
        return null;
      }
    }
  }
};

const openRouteModal = async (row: any) => {
  if (!row.route) {
    ElMessage.warning('无路径数据');
    return;
  }

  let routesData: any[][] = [];
  let routePayload: any = row.route;
  if (typeof routePayload === 'string') {
    routePayload = parseLooseJson(routePayload);
  }
  if (Array.isArray(routePayload)) {
    routesData = routePayload.map(r => parseRouteToSteps(r));
  } else if (routePayload && routePayload.molecules) {
    routesData = [parseRouteToSteps(routePayload)];
  }

  if (routesData.length === 0) {
    ElMessage.warning('路径数据解析失败');
    return;
  }

  currentRoutesData.value = routesData;
  
  // 处理多个图片路径
  let pngList: string[] = [];
  if (Array.isArray(row.png_file_names) && row.png_file_names.length > 0) {
    pngList = row.png_file_names;
  } else if (row.png_file_name) {
    try {
      const parsed = JSON.parse(row.png_file_name);
      pngList = Array.isArray(parsed) ? parsed : [row.png_file_name];
    } catch (e) {
      pngList = [row.png_file_name];
    }
  }

  currentRouteImgs.value = pngList.map(name => 
    name ? `${import.meta.env.VITE_API_URL}/web/${name}` : ''
  ).filter(url => !!url);

  routeModalVisible.value = true;

  // 预加载SDF (遍历所有路径)
  routesData.forEach(route => {
    route.forEach(step => {
      step.molecules.forEach(async (smiles: string) => {
        if (!routeSdfData.value[smiles]) {
          const res = await drawTask({ smiles });
          if (res.code === 200) routeSdfData.value[smiles] = res.data;
        }
      });
    });
  });
};

/* =========================
    其他操作
========================= */
const viewFile = (filename: string) => {
  if (!filename) return;
  window.open(`${import.meta.env.VITE_API_URL}/web/${filename}`, '_blank');
};

const getPdfFiles = (row: any) => {
  let pdfList: string[] = [];
  if (Array.isArray(row.pdf_file_names) && row.pdf_file_names.length > 0) {
    pdfList = row.pdf_file_names;
  } else if (row.pdf_file_name) {
    try {
      const parsed = JSON.parse(row.pdf_file_name);
      pdfList = Array.isArray(parsed) ? parsed : [row.pdf_file_name];
    } catch (e) {
      pdfList = [row.pdf_file_name];
    }
  }
  return pdfList.filter(f => !!f);
};

const handleStart = async (row: any) => {
  buttonLoading.value[row.task_id] = true;
  // 乐观更新：点击即显示“计算中”
  const originalPid = row.pid;
  row.pid = -1; 
  
  try {
    const res = await startProcess({ id: row.task_id });
    if (res.code === 200) {
      ElMessage.success('任务启动成功');
      fetchData();
    } else {
      ElMessage.error(res.msg || '启动失败');
      row.pid = originalPid; // 失败则还原
    }
  } catch (error) {
    ElMessage.error('启动失败');
    row.pid = originalPid; // 失败则还原
  } finally {
    buttonLoading.value[row.task_id] = false;
  }
};


const handleViewLogs = async (row: any) => {
  logsModalVisible.value = true;
  logsLoading.value = true;
  currentLogs.value = '';
  try {
    const res = await getTaskLogs({ uid: row.task_id });
    if (res.code === 200) {
      currentLogs.value = res.data.logs;
    } else {
      currentLogs.value = '获取日志失败: ' + (res.msg || '未知错误');
    }
  } catch (error) {
    currentLogs.value = '获取日志失败';
  } finally {
    logsLoading.value = false;
  }
};

const handleDelete = async (row: any) => {
  try {
    const userId = Local.get('userId') || '100';
    const res = await deleteTask({
      id: String(userId),
      uuid: row.task_id
    });

    if (res.code === 200) {
      ElMessage.success('任务已删除');
      fetchData();
    } else {
      ElMessage.error(res.msg || '删除失败');
    }
  } catch {
    ElMessage.error('删除失败');
  }
};

const openModal = (row: any) => {
  if (structureData.value[row.task_id]) {
    currentModalSdf.value = structureData.value[row.task_id];
    modalVisible.value = true;
  }
};

const copyText = (text: string) => {
  navigator.clipboard.writeText(text);
  ElMessage.success('已复制');
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  fetchData();
};

const handlePageChange = (val: number) => {
  currentPage.value = val;
  fetchData();
};

onBeforeUnmount(() => {
  stopPolling();
});

onMounted(fetchData);
</script>

<style scoped lang="scss">
.results-page { padding: 20px; background: #f8fafc; }
.results-table-card { border-radius: 8px; border: none; }
.results-pagination {
	margin-top: 18px;
  display: flex;
  justify-content: center; 
  background: #fff;
}
.structure-wrapper {
  width: 100%;
  height: 120px;
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 4px;
  cursor: zoom-in;
  position: relative;
  overflow: hidden;
  display: flex;
}
:deep(.molecule-canvas-container canvas) {
  width: 100% !important;
  height: 100% !important;
  position: absolute;
  top: 0;
  left: 0;
}

.smiles-text { font-family: monospace; font-size: 11px; color: #334155; word-break: break-all; }
.action-buttons { display: flex; gap: 1px; }

/* 模态框布局核心修改 */
.route-layout-container {
  height: 69vh; /* 固定容器高度 */
  overflow: hidden; /* 禁止大容器滚动 */
}

.route-left-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.route-modal-content { 
  flex: 1; 
  overflow-y: auto; /* 仅左侧内容区域允许滚动 */
  padding-right: 15px;
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
}

.panel-header {
  font-size: 14px; font-weight: bold; color: #475569; margin-bottom: 12px;
  padding-bottom: 8px; border-bottom: 2px solid #409eff;
  flex-shrink: 0;
}

.route-image-panel {
  display: flex; flex-direction: column;
  height: 100%;
}

.image-scroll-box { 
  flex: 1; 
  background: #fdfdfd; 
  border-radius: 8px; 
  //border: 1px solid #e2e8f0;
  overflow: auto; 
  display: flex;
  justify-content: center;
  align-items: flex-start;
  //padding: 10px;
}

.route-png {
  max-width: 100%;
  height: auto;
}

.image-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.image-item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
  background: #fff;
}

.image-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
  font-weight: bold;
}

.routes-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.route-item-container {
  border-bottom: 2px dashed #e2e8f0;
  padding-bottom: 20px;
  &:last-child { border-bottom: none; }
}

.route-item-header {
  font-size: 13px;
  font-weight: bold;
  color: #409eff;
  background: #f0f7ff;
  padding: 6px 12px;
  border-radius: 4px;
  margin-bottom: 15px;
  display: inline-block;
}

.molecules-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.step-node {
  background: #fff;
  border: 1px solid #e2e8f0; 
  border-radius: 8px; 
  padding: 12px;
  .step-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
  .step-index { font-size: 11px; font-weight: bold; color: #409eff; }
  .step-body { display: flex; gap: 10px; align-items: center; }
  .step-viewer-box { width: 110px; height: 90px; border: 1px solid #f1f5f9; flex-shrink: 0; position: relative; }
  .step-smiles { font-family: monospace; font-size: 11px; color: #1e293b; word-break: break-all; flex: 1; }
}

.step-arrow-down {
  margin: 10px 0; 
  color: #94a3b8; 
  display: flex; 
  flex-direction: column; 
  align-items: center;
  .el-icon { font-size: 20px; 
    color: #409EFF; }
}

.modal-viewer-wrapper { 
  width: 100%; 
  height: 500px; 
  background: #fff; 
  position: relative; 
}
.logs-container {
  max-height: 500px;
  overflow-y: auto;
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 15px;
  border-radius: 4px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
}
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 10;
}
.molecule-canvas-container {
  width: 100% !important;
  height: 100% !important;
  position: absolute;
  top: 0;
  left: 0;
}
.img-error { 
  color: #94a3b8; 
  font-size: 12px; 
  margin-top: 40px; 
}
</style>
