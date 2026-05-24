<template>
  <div class="detail-page">
    <el-card shadow="never" class="detail-card">
      <template #header>
        <div class="card-header">
          <el-button @click="goBack">
            <el-icon><ele-ArrowLeft /></el-icon>
            返回
          </el-button>
          <span class="page-title">优化结果详情</span>
          <span v-if="currentResults.length > 0" class="result-count">共 {{ currentResults.length }} 条结果</span>
        </div>
      </template>

      <div v-loading="detailLoading" class="detail-content">
        <el-empty v-if="!currentTask" description="加载中..." />
        <template v-else>
          <el-table v-if="currentResults.length > 0" :data="currentResults" stripe>
            <el-table-column label="酶编号" prop="Enzyme_id" width="70" align="center" />
            <el-table-column label="类型" prop="type" width="80" align="center" />
            <el-table-column label="序列" prop="sequence" min-width="450">
              <template #default="{ row }">
                <el-tooltip placement="top" popper-class="multiline-tooltip">
                  <template #content>
                    <div style="white-space: pre-wrap; word-break: break-all; max-width: 600px;" v-html="highlightMutations(row.sequence)"></div>
                  </template>
                  <span class="sequence-text copyable-text" @click="copyToClipboard(row.sequence, '序列')" v-html="highlightMutations(row.sequence)"></span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="SMILES" prop="smiles" min-width="200">
              <template #default="{ row }">
                <el-tooltip placement="top" popper-class="multiline-tooltip">
                  <template #content>
                    <div style="white-space: pre-wrap; word-break: break-all; max-width: 600px;">{{ row.smiles }}</div>
                  </template>
                  <span class="smiles-text copyable-text" @click="copyToClipboard(row.smiles, 'SMILES')">{{ row.smiles }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="活性" prop="pred_kcat(s^-1)" width="100" align="center" />
            <el-table-column label="最适温度" prop="pred_opt_temp" width="100" align="center" />
            <el-table-column label="表达量" prop="expression_score" width="100" align="center" />
          </el-table>
          <el-empty v-else description="暂无优化结果" />
        </template>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getEnzymeTaskDetail } from './api';

const route = useRoute();
const router = useRouter();

const detailLoading = ref(false);
const currentTask = ref<any>(null);
const currentResults = ref<any[]>([]);

const goBack = () => {
  router.back();
};

const copyToClipboard = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text);
    ElMessage.success(`${label}已复制到剪贴板`);
  } catch (error) {
    ElMessage.error('复制失败');
  }
};

// 对比原始序列和突变序列，标出突变位点
const highlightMutations = (mutatedSequence: string): string => {
  if (!currentTask.value || !currentTask.value.sequence) {
    return mutatedSequence;
  }
  
  const originalSequence = currentTask.value.sequence;
  let pocketSites = currentTask.value.pocket_sites || [];
  
  // 确保 pocketSites 是数字数组
  if (pocketSites.length > 0 && typeof pocketSites[0] === 'string') {
    pocketSites = pocketSites.map((s: any) => parseInt(s, 10));
  }
  
  // 如果序列长度不同，直接返回原序列
  if (originalSequence.length !== mutatedSequence.length) {
    console.warn('序列长度不同，无法对比');
    return mutatedSequence;
  }
  
  // 检查序列是否完全相同
  if (originalSequence === mutatedSequence) {
    console.log('序列完全相同，没有突变');
    return mutatedSequence;
  }
  
  let result = '';
  let mutationCount = 0;
  let firstMutationPosition = -1;
  
  for (let i = 0; i < mutatedSequence.length; i++) {
    const originalChar = originalSequence[i];
    const mutatedChar = mutatedSequence[i];
    const position = i + 1; // 位置从1开始
    
    // 如果字符不同
    if (originalChar !== mutatedChar) {
      if (firstMutationPosition === -1) {
        firstMutationPosition = position;
      }
      console.log(`位置 ${position}: ${originalChar} -> ${mutatedChar}, 是否在位点中: ${pocketSites.includes(position)}`);
      
      // 如果该位置在优化位点中，则标红
      if (pocketSites.includes(position)) {
        result += `<span class="mutation-highlight">${mutatedChar}</span>`;
        mutationCount++;
      } else {
        result += mutatedChar;
      }
    } else {
      result += mutatedChar;
    }
  }
  
  if (mutationCount > 0) {
    console.log(`总共标记的突变数: ${mutationCount}, 第一个突变位置: ${firstMutationPosition}`);
  } else {
    console.log('没有找到在优化位点中的突变');
    if (firstMutationPosition > 0) {
      console.log(`存在突变但不在优化位点中，第一个突变位置: ${firstMutationPosition}`);
    }
  }
  
  return result;
};

const fetchDetail = async () => {
  const taskUuid = route.params.uuid as string;
  if (!taskUuid) {
    ElMessage.error('任务ID不存在');
    goBack();
    return;
  }

  detailLoading.value = true;
  try {
    const res = await getEnzymeTaskDetail(taskUuid);
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

onMounted(fetchDetail);
</script>

<style scoped lang="scss">
.detail-page {
  padding: 24px;
  background: #f5f7fa;
  min-height: calc(100vh - 120px);
}

.detail-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  
  :deep(.el-card__header) {
    background: #fff;
    border-bottom: 2px solid #409eff;
    padding: 16px 24px;
  }
  
  :deep(.el-card__body) {
    padding: 0;
  }
  
  .card-header {
    display: flex;
    align-items: center;
    gap: 16px;
    
    .page-title {
      font-size: 20px;
      font-weight: 600;
      color: #303133;
      letter-spacing: 0.5px;
    }
    
    .result-count {
      color: #909399;
      font-size: 14px;
      margin-left: auto;
      background: #f4f4f5;
      padding: 4px 12px;
      border-radius: 12px;
      font-weight: 500;
    }
  }
}

.detail-content {
  min-height: 400px;
  padding: 20px 24px;
  background: #fff;
}

:deep(.el-table) {
  border-radius: 4px;
  overflow: hidden;
  
  th.el-table__cell {
    background: #f5f7fa;
    color: #606266;
    font-weight: 600;
    font-size: 14px;
    border-bottom: 2px solid #e4e7ed;
  }
  
  td.el-table__cell {
    color: #606266;
    font-size: 13px;
  }
  
  .el-table__row {
    transition: background-color 0.3s ease;
  }
  
  .el-table__row:hover > td {
    background-color: #f0f7ff !important;
  }
}

.sequence-text, .smiles-text {
  font-family: 'Courier New', Consolas, Monaco, monospace;
  font-size: 13px;
  color: #606266;
  word-break: break-all;
  line-height: 1.6;
}

.copyable-text {
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 2px 4px;
  border-radius: 3px;
}

.copyable-text:hover {
  color: #409eff;
  background-color: #f0f7ff;
}

.mutation-highlight {
  color: #f56c6c !important;
  font-weight: bold !important;
  background-color: rgba(245, 108, 108, 0.1) !important;
  padding: 2px 4px;
  border-radius: 3px;
  display: inline-block;
  border: 1px solid rgba(245, 108, 108, 0.3);
}

:deep(.multiline-tooltip) {
  white-space: pre-wrap !important;
  word-break: break-all !important;
  max-width: 600px !important;
  font-family: 'Courier New', Consolas, Monaco, monospace;
  font-size: 13px;
  line-height: 1.6;
}

:deep(.el-tooltip__popper.multiline-tooltip) {
  white-space: pre-wrap !important;
  word-break: break-all !important;
  max-width: 600px !important;
}

:deep(.multiline-tooltip .el-tooltip__inner) {
  white-space: pre-wrap !important;
  word-break: break-all !important;
  max-width: 600px !important;
  background: #303133;
  color: #fff;
  padding: 12px 16px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>

<style lang="scss">
.mutation-highlight {
  color: #f56c6c !important;
  font-weight: bold !important;
  background-color: rgba(245, 108, 108, 0.15) !important;
  padding: 0 2px;
  border-radius: 2px;
  display: inline-block;
}
</style>
