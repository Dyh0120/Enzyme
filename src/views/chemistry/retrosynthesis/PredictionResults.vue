<template>
  <div class="results-page">
    <div class="filter-bar">
      <el-select v-model="statusFilter" placeholder="任务状态" clearable style="width: 150px;" @change="fetchData">
        <el-option label="全部" :value="null" />
        <el-option label="处理中" :value="0" />
        <el-option label="已完成" :value="1" />
        <el-option label="已删除" :value="2" />
        <el-option label="失败" :value="3" />
      </el-select>
    </div>
    
    <el-table :data="taskList" border stripe v-loading="loading" table-layout="fixed">
        <el-table-column label="编号" width="80" align="center">
          <template #default="{ $index }">
            <span class="serial-number">{{ (currentPage - 1) * pageSize + $index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column label="序列信息" min-width="200">
          <template #default="{ row }">
            <el-tooltip placement="top" popper-class="multiline-tooltip">
              <template #content>
                <div style="white-space: pre-wrap; word-break: break-all; max-width: 600px;">{{ row.sequence }}</div>
              </template>
              <span class="sequence-text copyable-text" @click="copyToClipboard(row.sequence, '序列')" style="display: block; width: 100%; height: 100%; padding: 8px 0;">{{ row.sequence.substring(0, 50) }}{{ row.sequence.length > 50 ? '...' : '' }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="PDB文件" width="180">
          <template #default="{ row }">
            <span class="pdb-text">{{ row.pdb_file_name || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="底物SMILES" min-width="180">
          <template #default="{ row }">
            <el-tooltip placement="top" popper-class="multiline-tooltip">
              <template #content>
                <div style="white-space: pre-wrap; word-break: break-all; max-width: 600px;">{{ row.smiles }}</div>
              </template>
              <span class="smiles-text copyable-text" @click="copyToClipboard(row.smiles, 'SMILES')" style="display: block; width: 100%; height: 100%; padding: 8px 0;">{{ row.smiles }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="位点信息" width="150">
          <template #default="{ row }">
            <el-tag size="small" type="info">{{ row.pocket_sites?.join(', ') || '-' }}</el-tag>
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

        <el-table-column label="结果数量" width="70">
          <template #default="{ row }">
            <span class="result-count">{{ row.result_count || 0 }}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" width="170" prop="create_datetime" />

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button type="primary" link @click="handleViewDetail(row)">查看详情</el-button>
              
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
import { ElMessage } from 'element-plus';
import { getEnzymeTaskList, cancelEnzymeTask, deleteEnzymeTask } from './api';

const router = useRouter();

const taskList = ref<any[]>([]);
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);
const loading = ref(false);
const statusFilter = ref<number | null>(null);
const buttonLoading = ref<Record<string, boolean>>({});

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
.filter-bar { margin-bottom: 16px; }

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
  color: #334155; 
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

:deep(.el-tooltip__popper.multiline-tooltip) {
  white-space: pre-wrap !important;
  word-break: break-all !important;
  max-width: 600px !important;
}

:deep(.multiline-tooltip .el-tooltip__inner) {
  white-space: pre-wrap !important;
  word-break: break-all !important;
  max-width: 600px !important;
}
</style>
