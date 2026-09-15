<template>
  <div class="results-page">
    <div class="filter-bar">
      <el-select v-model="statusFilter" placeholder="任务状态" clearable style="width: 150px;" @change="fetchData">
        <el-option label="全部" :value="null" />
        <el-option label="处理中" :value="0" />
        <el-option label="已完成" :value="1" />
        <el-option label="失败" :value="3" />
      </el-select>
      <el-button
        type="danger"
        plain
        :loading="batchDeleting"
        :disabled="selectedRows.length === 0"
        @click="handleBatchDelete"
      >
        批量删除{{ selectedRows.length ? `（${selectedRows.length}）` : '' }}
      </el-button>
    </div>
    
    <el-table ref="tableRef" :data="taskList" border stripe v-loading="loading" table-layout="fixed" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="编号" width="80" align="center">
          <template #default="{ $index }">
            <span class="serial-number">{{ (currentPage - 1) * pageSize + $index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column label="序列信息" min-width="200">
          <template #default="{ row }">
            <span class="sequence-text copyable-text" @click="copyToClipboard(row.sequence, '序列')" style="display: block; width: 100%; height: 100%; padding: 8px 0;">{{ row.sequence.substring(0, 50) }}{{ row.sequence.length > 50 ? '...' : '' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="PDB文件" width="180">
          <template #default="{ row }">
            <span class="pdb-text">{{ row.pdb_file_name || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="底物SMILES" min-width="180">
          <template #default="{ row }">
            <span class="smiles-text copyable-text" @click="copyToClipboard(row.smiles, 'SMILES')" style="display: block; width: 100%; height: 100%; padding: 8px 0;">{{ row.smiles }}</span>
          </template>
        </el-table-column>

        <el-table-column label="位点信息" width="150">
          <template #default="{ row }">
            <el-tag size="small" type="info">{{ getDesignSites(row).join(', ') || '-' }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="优化目标" width="180">
          <template #default="{ row }">
            <div class="prediction-types">
              <el-tag
                v-for="(tag, idx) in formatPredictionTypes(getRawPredictionTypes(row))"
                :key="idx"
                :type="getPredictionTypeTagType(tag.value)"
                size="small"
                style="margin-right: 4px; margin-bottom: 2px;"
              >
                {{ tag.label }}
              </el-tag>
              <span v-if="formatPredictionTypes(getRawPredictionTypes(row)).length === 0">-</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="140">
          <template #default="{ row }">
            <div>
              <el-tag :type="getStatusType(row.status)" size="small">
                <el-icon v-if="row.status === 0" class="is-loading"><ele-Loading /></el-icon>
                {{ row.status_label }}
              </el-tag>
              <div v-if="row.started_at && row.finished_at" class="duration-text">
                耗时: {{ calculateDuration(row.started_at, row.finished_at) }}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="阶段" width="90">
          <template #default="{ row }">
            <span class="stage-text">{{ row.stage_label || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="结果数量" width="100">
          <template #default="{ row }">
            <span class="result-count">{{ getResultCount(row) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" width="170" prop="create_datetime" />

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button 
                type="primary" 
                link 
                :disabled="row.status !== 1"
                @click="handleViewDetail(row)">查看详情</el-button>
              
              <!-- <el-button 
                v-if="row.status === 0 && !row.cancel_requested"
                type="warning" 
                link 
                :loading="buttonLoading[row.uuid]"
                @click="handleCancel(row)"
              >取消</el-button> -->
              
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
  </div>


</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getEnzymeTaskList, cancelEnzymeTask, deleteEnzymeTask } from './api';

const router = useRouter();

const taskList = ref<any[]>([]);
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);
const loading = ref(false);
const statusFilter = ref<number | null>(null);
const buttonLoading = ref<Record<string, boolean>>({});
const batchDeleting = ref(false);

let pollingTimer: any = null;

const getStatusType = (status: number) => {
  const typeMap: Record<number, any> = {
    0: 'warning',
    1: 'success',
    2: 'info',
    3: 'danger'
  };
  return typeMap[status] || 'info';
};

// 优化目标值 -> 中文标签
const predictionTypeLabelMap: Record<string, string> = {
  activity: '活性',
  stability: '热稳定性',
  expression: '表达量',
  solubility: '可溶性',
  hydrophobicity: '疏水性',
};

// 兼容后端 predict / prediction_type 两种字段命名
const getRawPredictionTypes = (row: any) => (row ? (row.predict ?? row.prediction_type) : undefined);

// 位点信息字段：兼容 design_sites / pocket_sites
const getDesignSites = (row: any): any[] => row?.design_sites ?? row?.pocket_sites ?? [];

const formatPredictionTypes = (predictionType: any): { value: string; label: string }[] => {
  if (!predictionType) return [];
  
  let types: string[] = [];
  if (Array.isArray(predictionType)) {
    types = predictionType.map(String);
  } else if (typeof predictionType === 'string') {
    types = predictionType.split(',').map(s => s.trim()).filter(Boolean);
  } else if (typeof predictionType === 'number') {
    types = [String(predictionType)];
  }
  
  return types
    .filter(v => predictionTypeLabelMap[v])
    .map(v => ({ value: v, label: predictionTypeLabelMap[v] }));
};

const getPredictionTypeTagType = (value: string) => {
  const typeMap: Record<string, any> = {
    activity: 'primary',
    stability: 'warning',
    expression: 'success',
    solubility: 'danger',
    hydrophobicity: 'info',
  };
  return typeMap[value] || 'info';
};

// 结果数量：后端返回条数排除一条原始（未更改）的酶
const getResultCount = (row: any): number => Math.max(0, (row?.result_count || 0) - 1);

const calculateDuration = (startTime: string, endTime: string): string => {
  if (!startTime || !endTime) return '-';
  
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const duration = end - start;
  
  if (duration < 0) return '-';
  
  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}小时${minutes % 60}分钟${seconds % 60}秒`;
  } else if (minutes > 0) {
    return `${minutes}分钟${seconds % 60}秒`;
  } else {
    return `${seconds}秒`;
  }
};

const fetchData = async (isPolling = false) => {
  if (!isPolling) loading.value = true;

  try {
    const params: any = {
      page: currentPage.value,
      pagesize: pageSize.value,
      include_deleted: 0
    };
    
    if (statusFilter.value !== null) {
      params.status = statusFilter.value;
    }

    const res = await getEnzymeTaskList(params);

    if (res.code === 200) {
      taskList.value = res.data.list || [];
      total.value = res.data.total || 0;

      const hasProcessing = taskList.value.some(item => item.status === 0);
      if (hasProcessing) {
        startPolling();
      } else {
        stopPolling();
      }
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
  }, 5000);
};

const stopPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
};

const handleViewDetail = (row: any) => {
  router.push({
    name: 'enzymeTaskDetail',
    params: { uuid: row.uuid }
  });
};

const handleCancel = async (row: any) => {
  buttonLoading.value[row.uuid] = true;
  
  try {
    const res = await cancelEnzymeTask({ uuid: row.uuid });
    if (res.code === 200) {
      ElMessage.success('任务已取消');
      fetchData();
    } else {
      ElMessage.error(res.msg || '取消失败');
    }
  } catch (error) {
    ElMessage.error('取消失败');
  } finally {
    buttonLoading.value[row.uuid] = false;
  }
};

const handleDelete = async (row: any) => {
  try {
    const res = await deleteEnzymeTask({ uuid: row.uuid });
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

// 表格多选
const tableRef = ref();
const selectedRows = ref<any[]>([]);
const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows;
};

// 批量删除勾选的任务（无批量接口，逐个调用删除）
const handleBatchDelete = async () => {
  const targets = selectedRows.value;
  if (targets.length === 0) {
    ElMessage.warning('请先勾选要删除的任务');
    return;
  }
  try {
    await ElMessageBox.confirm(
      `确定要删除勾选的 ${targets.length} 个任务吗？此操作不可恢复。`,
      '批量删除确认',
      {
        type: 'warning',
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        confirmButtonClass: 'el-button--danger',
      }
    );
  } catch {
    return; // 用户取消
  }
  batchDeleting.value = true;
  try {
    let success = 0;
    const failed: any[] = [];
    for (const task of targets) {
      try {
        const res = await deleteEnzymeTask({ uuid: task.uuid });
        if (res.code === 200) success++;
        else failed.push(task.uuid);
      } catch {
        failed.push(task.uuid);
      }
    }
    if (failed.length === 0) {
      ElMessage.success(`已删除 ${success} 个任务`);
    } else {
      ElMessage.warning(`删除完成：成功 ${success} 个，失败 ${failed.length} 个`);
    }
    tableRef.value?.clearSelection();
    selectedRows.value = [];
    fetchData();
  } catch (error: any) {
    ElMessage.error(error.message || '批量删除失败');
  } finally {
    batchDeleting.value = false;
  }
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  fetchData();
};

const handlePageChange = (val: number) => {
  currentPage.value = val;
  fetchData();
};

const copyToClipboard = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text);
    ElMessage.success(`${label}已复制到剪贴板`);
  } catch (error) {
    ElMessage.error('复制失败');
  }
};

onBeforeUnmount(() => {
  stopPolling();
});

onMounted(fetchData);
</script>

<style scoped lang="scss">
.results-page { padding: 20px; background: #f8fafc; }
.filter-bar { margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; }

.results-pagination {
	margin-top: 18px;
  display: flex;
  justify-content: center; 
  background: #fff;
}

.serial-number {
  font-weight: 600;
  color: #409eff;
  font-size: 14px;
}

.sequence-text, .smiles-text, .pdb-text { 
  font-family: monospace; 
  font-size: 12px; 
  color: black; 
  word-break: break-all; 
}

.copyable-text {
  cursor: pointer;
  transition: color 0.2s;
}

.copyable-text:hover {
  color: #409eff;
}

.stage-text { font-size: 12px; color: #475569; }
.duration-text { 
  font-size: 11px; 
  color: #64748b; 
  margin-top: 4px;
}
.result-count { font-size: 14px; font-weight: 600; color: #409eff; }
.action-buttons { display: flex; gap: 4px; flex-wrap: wrap; }
</style>
