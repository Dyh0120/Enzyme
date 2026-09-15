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
          <span v-if="currentResults.length > 0" class="result-count">共 {{ resultCount }} 条结果</span>
          <el-button
            v-if="currentResults.length > 0"
            type="primary"
            class="download-btn"
            @click="handleDownloadResults"
          >
            <el-icon><ele-Download /></el-icon>
            下载结果文件
          </el-button>
        </div>
      </template>

      <div v-loading="detailLoading" class="detail-content">
        <el-empty v-if="!currentTask" description="加载中..." />
        <template v-else>
          <div class="task-info-panel">
            <el-descriptions :column="3" border size="default">
              <el-descriptions-item label="优化目标">
                <div class="prediction-types">
                  <el-tag
                    v-for="(tag, idx) in formatPredictionTypes(getRawPredictionTypes(currentTask))"
                    :key="idx"
                    :type="getPredictionTypeTagType(tag.value)"
                    size="small"
                    style="margin-right: 4px;"
                  >
                    {{ tag.label }}
                  </el-tag>
                  <span v-if="formatPredictionTypes(getRawPredictionTypes(currentTask)).length === 0">-</span>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="PDB文件">{{ currentTask.pdb_file_name || '-' }}</el-descriptions-item>
              <el-descriptions-item label="位点信息">
                <el-tag size="small" type="info">{{ getDesignSites(currentTask).join(', ') || '-' }}</el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <el-table v-if="currentResults.length > 0" :data="currentResults" stripe :row-class-name="tableRowClassName" style="margin-top: 16px;">
            <el-table-column label="编号" width="80" align="center">
              <template #default="{ $index }">
                <span class="row-index">{{ $index }}</span>
              </template>
            </el-table-column>
            <el-table-column label="类型" width="90" align="center">
              <template #default="{ row }">
                <span :class="isOriginalEnzyme(row) ? 'type-original' : 'type-mutant'">{{ isOriginalEnzyme(row) ? (row.type || 'wild') : 'mutant' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="序列" prop="sequence" min-width="450">
              <template #default="{ row }">
                <span class="sequence-text copyable-text" @click="copyToClipboard(row.sequence, '序列')" v-html="highlightMutations(row.sequence)"></span>
              </template>
            </el-table-column>
            <el-table-column label="SMILES" prop="smiles" min-width="200">
              <template #default="{ row }">
                <span class="smiles-text copyable-text" @click="copyToClipboard(row.smiles, 'SMILES')">{{ row.smiles }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="hasPredictionType('activity')" label="活性 (s⁻¹·M⁻¹)" prop="kcat_over_KM" width="140" align="center" />
            <el-table-column v-if="hasPredictionType('stability')" label="热稳定性 (°C)" prop="T50_C" width="120" align="center" />
            <el-table-column v-if="hasPredictionType('expression')" label="表达量 (mg/ml)" prop="yield" width="130" align="center" />
            <el-table-column v-if="hasPredictionType('solubility')" label="可溶性 (mg/ml)" prop="solubility" width="130" align="center" />
            <el-table-column v-if="hasPredictionType('hydrophobicity')" label="疏水性" prop="protein_gravy" width="120" align="center" />
            <!-- 隐藏：疏水性变化(vs WT) 列（如需恢复取消注释） -->
            <!-- <el-table-column v-if="hasPredictionType('hydrophobicity')" label="疏水性变化(vs WT)" prop="delta_gravy_vs_wt" width="100" align="center" /> -->
          </el-table>
          <el-empty v-else description="暂无优化结果" />
        </template>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import * as XLSX from 'xlsx';
import { getEnzymeTaskDetail } from './api';

const route = useRoute();
const router = useRouter();

const detailLoading = ref(false);
const currentTask = ref<any>(null);
const currentResults = ref<any[]>([]);

// 优化目标值 -> 中文标签
const predictionTypeLabelMap: Record<string, string> = {
  activity: '活性',
  stability: '热稳定性',
  expression: '表达量',
  solubility: '可溶性',
  hydrophobicity: '疏水性',
};

// 兼容后端 predict / prediction_type 两种字段命名
const getRawPredictionTypes = (obj: any) => obj?.predict ?? obj?.prediction_type;

// 位点信息字段：兼容 design_sites / pocket_sites
const getDesignSites = (obj: any): any[] => obj?.design_sites ?? obj?.pocket_sites ?? [];

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

// 判断当前任务的优化目标是否包含指定类型
const hasPredictionType = (value: string): boolean => {
  return formatPredictionTypes(getRawPredictionTypes(currentTask.value)).some(t => t.value === value);
};

// 判断某条结果是否为原始（未更改）的酶：酶编号为 0，或序列与任务输入的原始序列一致
const isOriginalEnzyme = (row: any): boolean => {
  if (Number(row?.Enzyme_id) === 0) return true;
  return !!currentTask.value?.sequence && row?.sequence === currentTask.value.sequence;
};

// 结果数量：排除一条原始（未更改）的酶
const resultCount = computed(() => Math.max(0, currentResults.value.length - 1));

// el-table 行样式：原始酶所在行高亮标注
const tableRowClassName = ({ row }: { row: any }): string =>
  isOriginalEnzyme(row) ? 'original-enzyme-row' : '';

// 优化目标值 -> 结果数据字段 映射
const targetFieldMap: Record<string, string> = {
  activity: 'kcat_over_KM',
  stability: 'T50_C',
  expression: 'yield',
  solubility: 'solubility',
  hydrophobicity: 'protein_gravy',
};

// 原始酶始终置顶；其余按“第一个优化目标”降序排序（无对应数值的排在最后）
const sortResultsByFirstTarget = (results: any[]): any[] => {
  const firstType = formatPredictionTypes(getRawPredictionTypes(currentTask.value))[0]?.value;
  const field = firstType ? targetFieldMap[firstType] : '';
  const toNum = (v: any): number => {
    const n = Number(v);
    return Number.isFinite(n) ? n : -Infinity;
  };
  return [...results].sort((a, b) => {
    // 原始酶（酶编号 0）始终在最上边
    const ao = isOriginalEnzyme(a) ? 1 : 0;
    const bo = isOriginalEnzyme(b) ? 1 : 0;
    if (ao !== bo) return bo - ao;
    if (!field) return 0;
    const va = toNum(a[field]);
    const vb = toNum(b[field]);
    if (va === vb) return 0;
    return vb - va;
  });
};

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

// 下载优化结果为 Excel（标准 .xlsx）
const handleDownloadResults = () => {
  if (currentResults.value.length === 0) {
    ElMessage.warning('暂无优化结果可下载');
    return;
  }

  // 导出列与页面表格保持一致：编号从 0 开始、类型区分 wild/mutant
  const columns: { title: string; key: string }[] = [
    { title: '编号', key: '__index__' },
    { title: '类型', key: '__type__' },
    { title: '序列', key: 'sequence' },
    { title: 'SMILES', key: 'smiles' },
  ];
  if (hasPredictionType('activity')) columns.push({ title: '活性 (s⁻¹·M⁻¹)', key: 'kcat_over_KM' });
  if (hasPredictionType('stability')) columns.push({ title: '热稳定性 (°C)', key: 'T50_C' });
  if (hasPredictionType('expression')) columns.push({ title: '表达量 (mg/ml)', key: 'yield' });
  if (hasPredictionType('solubility')) columns.push({ title: '可溶性 (mg/ml)', key: 'solubility' });
  if (hasPredictionType('hydrophobicity')) {
    columns.push({ title: '疏水性(GRAVY)', key: 'protein_gravy' });
    // columns.push({ title: 'ΔGRAVY(vs WT)', key: 'delta_gravy_vs_wt' }); // 隐藏：疏水性变化(vs WT) 列
  }

  // 组装二维数组：首行表头 + 数据行（空值统一转空字符串）
  const aoa: (string | number)[][] = [
    columns.map(col => col.title),
    ...currentResults.value.map((row: any, index: number) =>
      columns.map(col => {
        if (col.key === '__index__') return index;
        if (col.key === '__type__') return isOriginalEnzyme(row) ? (row.type || 'wild') : 'mutant';
        const value = row[col.key];
        return value === undefined || value === null ? '' : value;
      })
    ),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(aoa);
  // 设置列宽（序列/SMILES 列适当加宽，便于查看）
  const widthMap: Record<string, number> = {
    '__index__': 10,
    '__type__': 10,
    'sequence': 60,
    'smiles': 30,
    'kcat_over_KM': 14,
    'T50_C': 12,
    'yield': 12,
    'solubility': 12,
    'protein_gravy': 14,
    // 'delta_gravy_vs_wt': 14, // 隐藏：疏水性变化(vs WT) 列
  };
  worksheet['!cols'] = columns.map(col => ({ wch: widthMap[col.key] || 14 }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '优化结果');

  // 生成安全的文件名（替换 Windows 文件名非法字符）
  const timestamp = new Date().toLocaleString().replace(/[/:\s]+/g, '-');
  XLSX.writeFile(workbook, `优化结果_${timestamp}.xlsx`);
};

// 对比原始序列和突变序列，标出突变位点
const highlightMutations = (mutatedSequence: string): string => {
  if (!currentTask.value || !currentTask.value.sequence) {
    return mutatedSequence;
  }
  
  const originalSequence = currentTask.value.sequence;
  let pocketSites = getDesignSites(currentTask.value);
  
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
      currentResults.value = sortResultsByFirstTarget(res.data.results || []);
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

    .download-btn {
      flex-shrink: 0;
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

// 原始（未更改）酶所在行高亮标注
:deep(.el-table tr.original-enzyme-row > td) {
  background-color: #fff7e6 !important;
}

:deep(.el-table tr.original-enzyme-row > td:first-child) {
  box-shadow: inset 3px 0 0 0 #e6a23c;
}

.row-index {
  font-weight: 600;
  color: #303133;
}

.type-original {
  color: #e6a23c;
  font-weight: 600;
}

.type-mutant {
  color: #606266;
}

.sequence-text, .smiles-text {
  font-family: 'Courier New', Consolas, Monaco, monospace;
  font-size: 13px;
  color: #000;
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
