<template>
  <div class="results-page">
    <el-card shadow="none" class="results-table-card">
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
        <el-table-column label="任务UUID" width="280">
          <template #default="{ row }">
            <el-tooltip :content="row.uuid" placement="top">
              <span class="uuid-text">{{ row.uuid }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="序列信息" min-width="200">
          <template #default="{ row }">
            <el-tooltip :content="row.sequence" placement="top">
              <span class="sequence-text">{{ row.sequence.substring(0, 50) }}{{ row.sequence.length > 50 ? '...' : '' }}</span>
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
            <el-tooltip :content="row.smiles" placement="top">
              <span class="smiles-text">{{ row.smiles }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="位点信息" width="150">
          <template #default="{ row }">
            <el-tag size="small" type="info">{{ row.pocket_sites?.join(', ') || '-' }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              <el-icon v-if="row.status === 0" class="is-loading"><ele-Loading /></el-icon>
              {{ row.status_label }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="阶段" width="160">
          <template #default="{ row }">
            <span class="stage-text">{{ row.stage_label || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="结果数量" width="100">
          <template #default="{ row }">
            <span class="result-count">{{ row.result_count || 0 }}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" width="170" prop="create_datetime" />

        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button type="primary" link @click="handleViewDetail(row)">查看详情</el-button>
              
              <el-button 
                v-if="row.status === 0 && !row.cancel_requested"
                type="warning" 
                link 
                :loading="buttonLoading[row.uuid]"
                @click="handleCancel(row)"
              >取消</el-button>
              
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

    <el-dialog v-model="detailModalVisible" title="任务详情" width="1200px" destroy-on-close align-center class="detail-custom-dialog">
      <div v-loading="detailLoading" class="detail-content">
        <el-empty v-if="!currentTask" description="加载中..." />
        <template v-else>
          <el-descriptions :column="2" border class="task-info">
            <el-descriptions-item label="任务UUID">{{ currentTask.uuid }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="getStatusType(currentTask.status)">{{ currentTask.status_label }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="阶段">{{ currentTask.stage_label || '-' }}</el-descriptions-item>
            <el-descriptions-item label="结果数量">{{ currentTask.result_count || 0 }}</el-descriptions-item>
            <el-descriptions-item label="PDB文件">{{ currentTask.pdb_file_name || '-' }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ currentTask.create_datetime }}</el-descriptions-item>
            <el-descriptions-item label="开始时间">{{ currentTask.started_at || '-' }}</el-descriptions-item>
            <el-descriptions-item label="完成时间">{{ currentTask.finished_at || '-' }}</el-descriptions-item>
          </el-descriptions>
          
          <el-divider content-position="left">序列信息</el-divider>
          <el-input
            v-model="currentTask.sequence"
            type="textarea"
            :rows="4"
            readonly
            class="detail-textarea"
          />
          
          <el-divider content-position="left">底物SMILES</el-divider>
          <el-input
            v-model="currentTask.smiles"
            type="textarea"
            :rows="2"
            readonly
            class="detail-textarea"
          />
          
          <el-divider content-position="left">位点信息</el-divider>
          <el-tag v-for="site in currentTask.pocket_sites" :key="site" style="margin-right: 8px; margin-bottom: 8px;">
            {{ site }}
          </el-tag>
          
          <el-divider v-if="currentTask.error_message" content-position="left">错误信息</el-divider>
          <el-alert v-if="currentTask.error_message" :title="currentTask.error_message" type="error" show-icon />
          
          <el-divider v-if="currentResults.length > 0" content-position="left">优化结果</el-divider>
          <el-table v-if="currentResults.length > 0" :data="currentResults" border stripe max-height="400">
            <el-table-column label="Enzyme ID" prop="Enzyme_id" width="180" />
            <el-table-column label="类型" prop="type" width="100" />
            <el-table-column label="序列" prop="sequence" min-width="200">
              <template #default="{ row }">
                <el-tooltip :content="row.sequence" placement="top">
                  <span class="sequence-text">{{ row.sequence }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="SMILES" prop="smiles" min-width="180">
              <template #default="{ row }">
                <el-tooltip :content="row.smiles" placement="top">
                  <span class="smiles-text">{{ row.smiles }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="pred_kcat" prop="pred_kcat(s^-1)" width="120">
              <template #default="{ row }">
                {{ row['pred_kcat(s^-1)']?.toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column label="pred_opt_temp" prop="pred_opt_temp" width="130">
              <template #default="{ row }">
                {{ row.pred_opt_temp?.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column label="expression_score" prop="expression_score" width="150">
              <template #default="{ row }">
                {{ row.expression_score?.toFixed(4) }}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ElMessage } from 'element-plus';
import { getEnzymeTaskList, getEnzymeTaskDetail, cancelEnzymeTask, deleteEnzymeTask } from './api';

const taskList = ref<any[]>([]);
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);
const loading = ref(false);
const statusFilter = ref<number | null>(null);
const buttonLoading = ref<Record<string, boolean>>({});

const detailModalVisible = ref(false);
const detailLoading = ref(false);
const currentTask = ref<any>(null);
const currentResults = ref<any[]>([]);

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

const handleViewDetail = async (row: any) => {
  detailModalVisible.value = true;
  detailLoading.value = true;
  currentTask.value = null;
  currentResults.value = [];

  try {
    const res = await getEnzymeTaskDetail(row.uuid);
    if (res.code === 200) {
      currentTask.value = res.data.task;
      currentResults.value = res.data.results || [];
    } else {
      ElMessage.error(res.msg || '获取详情失败');
    }
  } catch (error) {
    ElMessage.error('获取详情失败');
  } finally {
    detailLoading.value = false;
  }
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

onBeforeUnmount(() => {
  stopPolling();
});

onMounted(fetchData);
</script>

<style scoped lang="scss">
.results-page { padding: 20px; background: #f8fafc; }
.results-table-card { border-radius: 8px; border: none; }
.filter-bar { margin-bottom: 16px; }

.results-pagination {
	margin-top: 18px;
  display: flex;
  justify-content: center; 
  background: #fff;
}

.uuid-text, .sequence-text, .smiles-text, .pdb-text { 
  font-family: monospace; 
  font-size: 12px; 
  color: #334155; 
  word-break: break-all; 
}

.stage-text { font-size: 12px; color: #475569; }
.result-count { font-size: 14px; font-weight: 600; color: #409eff; }
.action-buttons { display: flex; gap: 4px; flex-wrap: wrap; }

.detail-custom-dialog {
  :deep(.el-dialog__body) {
    padding: 20px;
  }
}

.detail-content {
  min-height: 200px;
}

.task-info {
  margin-bottom: 20px;
}

.detail-textarea {
  :deep(.el-textarea__inner) {
    font-family: monospace;
    font-size: 12px;
  }
}
</style>
