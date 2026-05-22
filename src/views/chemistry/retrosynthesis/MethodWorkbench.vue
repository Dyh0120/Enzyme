<template>
	<div class="retro-page" :style="{ '--retro-accent': methodInfo.accent }">
		<el-card class="retro-hero" shadow="never">
			<div class="retro-hero__content">
				<div>
					<p class="retro-hero__eyebrow">{{ methodInfo.eyebrow }}</p>
					<h1 class="retro-hero__title">{{ parentMeta.title }} · {{ methodInfo.title }}</h1>
					<p class="retro-hero__description">
						{{ methodInfo.description }}
					</p>
					<el-tag class="retro-hero__tag" effect="dark">
						{{ methodInfo.heroHint }}
					</el-tag>
				</div>
				<el-button type="primary" size="large" plain @click="handleOpenCanvas">
					<el-icon>
						<ele-MagicStick />
					</el-icon>
					绘制画板
				</el-button>
			</div>
		</el-card>

		<el-row :gutter="20" class="retro-cards-row">
			<!-- 左侧：主表单区域 -->
			<el-col :xs="24" :lg="16" class="retro-card-col">
				<el-card class="retro-form-card" shadow="hover">
					<template #header>
						<div class="card-header">
							<span class="card-title">分子结构输入</span>
						</div>
					</template>
					
					<el-form :model="form" class="retro-form">
						<el-form-item>
							<template #label>
								<span class="form-label">
									<el-icon><ele-Edit /></el-icon>
									SMILES 字符串
								</span>
							</template>
							<el-input
								v-model="form.smiles"
								type="textarea"
								:rows="3"
								placeholder="请输入或粘贴 SMILES 字符串，例如：CCO (乙醇) 或 CC(=O)O (乙酸)"
								clearable
								:resize="'none'"
								class="smiles-input"
							/>
							<template #error>
								<div class="form-tip">
									<el-icon><ele-Info /></el-icon>
									<span>支持标准 SMILES 格式，可包含原子映射标记（如 [C:1]）</span>
								</div>
							</template>
						</el-form-item>
						
						<!-- 输入统计信息 -->
						<div class="input-stats">
							<div class="stat-item">
								<el-icon class="stat-icon"><ele-Document /></el-icon>
								<span class="stat-label">字符数：</span>
								<span class="stat-value">{{ form.smiles.length }}</span>
							</div>
							<div class="stat-item">
								<el-icon class="stat-icon"><ele-Check /></el-icon>
								<span class="stat-label">状态：</span>
								<span class="stat-value" :class="{ 'stat-success': form.smiles.length > 0, 'stat-empty': form.smiles.length === 0 }">
									{{ form.smiles.length > 0 ? '已输入' : '待输入' }}
								</span>
							</div>
						</div>
						
						<!-- 两个参数输入 -->
						<div class="parameter-config">
  <div class="config-header">
    <el-icon><ele-Setting /></el-icon>
    <span>预测参数设置</span>
  </div>
  <div class="config-content">
    <div class="config-item">
      <span class="config-label">最大迭代次数:</span>
      <el-input-number 
        v-model="form.iterations" 
        :min="1" 
        :max="2000" 
        size="small"
        controls-position="right"
      />
    </div>
    <div class="config-item">
      <span class="config-label">Top-K 扩展数:</span>
      <el-input-number 
        v-model="form.expansion_topk" 
        :min="1" 
        :max="100" 
        size="small"
        controls-position="right"
      />
    </div>
  </div>
</div>
						
						<div class="quick-examples">
							<span class="quick-examples-label">快速示例：</span>
							<el-button size="small" @click="loadExample('[CH3:1][C:2](=[O:3])[c:4]1[cH:5][cH:6][c:7]2[c:8]([cH:9][cH:10][n:11]2[C:12](=[O:13])[O:14][C:15]([CH3:16])([CH3:17])[CH3:18])[cH:19]1')">
								加载示例
							</el-button>
						</div>
						
						<div class="retro-form__actions">
							<el-button type="success" size="large" :loading="loading" @click="handlePredict">
								<template #icon>
									<el-icon>
										<ele-Guide />
									</el-icon>
								</template>
								{{ loading ? '正在预测…' : '开始预测' }}
							</el-button>
							<span v-if="loading" class="retro-form__hint">
								正在生成预测结果，预测完成后会提示您
							</span>
						</div>
					</el-form>
				</el-card>
			</el-col>
			
			<!-- 右侧：帮助信息区域 -->
			<el-col :xs="24" :lg="8" class="retro-card-col">
				<!-- 使用提示 -->
				<el-card class="info-card tips-card" shadow="hover">
					<template #header>
						<div class="info-card-header">
							<el-icon><ele-Lightbulb /></el-icon>
							<span>使用提示</span>
						</div>
					</template>
					<div class="tips-content">
						<el-alert
							type="info"
							:closable="false"
							show-icon
							class="tip-alert"
						>
							<template #title>
								<div class="tip-item">
									<strong>方式一：</strong>直接在输入框中输入或粘贴 SMILES 字符串
								</div>
							</template>
						</el-alert>
						<el-alert
							type="success"
							:closable="false"
							show-icon
							class="tip-alert"
						>
							<template #title>
								<div class="tip-item">
									<strong>方式二：</strong>点击"绘制画板"按钮，使用可视化编辑器绘制分子结构
								</div>
							</template>
						</el-alert>
						<el-alert
							type="warning"
							:closable="false"
							show-icon
							class="tip-alert"
						>
							<template #title>
								<div class="tip-item">
									<strong>方式三：</strong>点击快速示例按钮，快速加载示例分子的SMILES字符串
								</div>
							</template>
						</el-alert>
						<el-alert
							type="info"
							:closable="false"
							show-icon
							class="tip-alert"
						>
							<template #title>
								<div class="tip-item">
									<strong>提示：</strong>支持标准 SMILES 格式，可包含原子映射标记
								</div>
							</template>
						</el-alert>
					</div>
				</el-card>
			</el-col>
		</el-row>

		<!-- Ketcher 画板弹窗 -->
		<el-dialog
			v-model="ketcherDialogVisible"
			title="化学结构编辑器"
			width="90%"
			top="2vh"
			:close-on-click-modal="false"
			:close-on-press-escape="true"
			class="ketcher-dialog"
			modal-class="ketcher-dialog-modal"
			@closed="handleKetcherClose"
		>
			<div class="ketcher-container">
				<iframe
					ref="ketcherIframe"
					:src="ketcherUrl"
					class="ketcher-iframe"
					frameborder="0"
					allowfullscreen
					@load="handleKetcherLoad"
				></iframe>
			</div>
			<template #footer>
				<div class="ketcher-dialog-footer">
					<div class="ketcher-smiles-input">
						<el-input
							v-model="tempSmiles"
							placeholder="点击'获取 SMILES'按钮获取SMILES"
							clearable
							style="margin-right: 12px; flex: 1;"
						>
							<template #prepend>SMILES</template>
						</el-input>
					</div>
					<div class="ketcher-dialog-buttons">
						<el-button @click="handleGetSmiles" :loading="gettingSmiles">获取 SMILES</el-button>
						<el-button type="primary" @click="handleConfirmSmiles">确认并应用</el-button>
						<el-button @click="ketcherDialogVisible = false">关闭</el-button>
					</div>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { chemistryMethodMetas, chemistryParentMeta, getChemistryMetaByKey } from '/@/router/chemistry';
import axios from 'axios'; 

const route = useRoute();
const loading = ref(false);
const timer = ref<ReturnType<typeof setTimeout> | null>(null);
const ketcherDialogVisible = ref(false);
const ketcherIframe = ref<HTMLIFrameElement | null>(null);
const tempSmiles = ref('');
const gettingSmiles = ref(false);
const ketcherReady = ref(false);

const form = reactive({
  smiles: '',
  iterations: 500,      // 默认值
  expansion_topk: 50     // 默认值
});

// 加载示例
const loadExample = (smiles: string) => {
	form.smiles = smiles;
	ElMessage({
		type: 'success',
		message: '已加载示例',
		duration: 2000,
	});
};

// Ketcher 画板 URL
const ketcherUrl = '/ketcher-standalone-v2.6.4/standalone/index.html';

const parentMeta = chemistryParentMeta;

const methodInfo = computed(() => {
	const key = route.meta?.methodKey as string;
	return getChemistryMetaByKey(key) || chemistryMethodMetas[0];
});

const resetLoading = () => {
	if (timer.value) {
		clearTimeout(timer.value);
		timer.value = null;
	}
	loading.value = false;
};

const handleOpenCanvas = () => {
	ketcherDialogVisible.value = true;
	tempSmiles.value = form.smiles;
};

const handleKetcherLoad = () => {
	// iframe 加载完成后，注入 postMessage 监听器
	ketcherReady.value = true;
	if (ketcherIframe.value?.contentWindow) {
		try {
			// 尝试注入脚本到 iframe 中
			const iframeDoc = ketcherIframe.value.contentDocument || ketcherIframe.value.contentWindow?.document;
			if (iframeDoc) {
				// 等待 Ketcher 加载完成
				setTimeout(() => {
					injectKetcherMessageHandler();
				}, 2000);
			}
		} catch (error) {
			// 跨域限制，无法直接访问
			console.log('无法访问 iframe 内容，可能需要通过 postMessage');
		}
	}
};

const injectKetcherMessageHandler = () => {
	if (ketcherIframe.value?.contentWindow) {
		try {
			console.log('Ketcher 消息处理器已通过 HTML 文件注入');
		} catch (error) {
			console.log('无法注入脚本，使用备用方案');
		}
	}
};

const handleKetcherClose = () => {
	// 弹窗关闭时清理事件监听器
	if (messageHandler) {
		window.removeEventListener('message', messageHandler);
		messageHandler = null;
	}
	ketcherReady.value = false;
};

let messageHandler: ((event: MessageEvent) => void) | null = null;

const handleGetSmiles = async () => {
	gettingSmiles.value = true;
	
	// 尝试通过 postMessage 获取
	if (ketcherIframe.value?.contentWindow && ketcherReady.value) {
		try {
			// 清理之前的事件监听器
			if (messageHandler) {
				window.removeEventListener('message', messageHandler);
			}
			
			// 设置超时
			let timeoutId: ReturnType<typeof setTimeout> | null = null;
			let resolved = false;
			
			// 监听来自 ketcher 的消息
			messageHandler = (event: MessageEvent) => {
				// 检查消息来源
				if (event.data && event.data.type === 'smiles') {
					resolved = true;
					if (timeoutId) clearTimeout(timeoutId);
					tempSmiles.value = event.data.smiles || '';
					form.smiles = tempSmiles.value;
					ElMessage({
						type: 'success',
						message: `已获取 SMILES: ${tempSmiles.value}`,
					});
					if (messageHandler) {
						window.removeEventListener('message', messageHandler);
						messageHandler = null;
					}
					gettingSmiles.value = false;
				}
			};
			window.addEventListener('message', messageHandler);
			
			// 发送获取 SMILES 的请求
			ketcherIframe.value.contentWindow.postMessage(
				{ type: 'getSmiles' },
				'*'
			);
			
			// 设置超时
			timeoutId = setTimeout(() => {
				if (!resolved) {
					// 尝试直接访问 iframe 内部的 ketcher 实例
					try {
						const iframeWindow = ketcherIframe.value?.contentWindow as any;
						if (iframeWindow && iframeWindow.ketcher) {
							iframeWindow.ketcher.getSmiles().then((smiles: string) => {
								tempSmiles.value = smiles;
								form.smiles = smiles;
								ElMessage({
									type: 'success',
									message: `已获取 SMILES: ${smiles}`,
								});
								gettingSmiles.value = false;
							}).catch(() => {
								// 提示用户手动复制
								ElMessage({
									type: 'info',
									message: '无法自动获取，请在画板中点击"Copy"按钮复制 SMILES，然后粘贴到下方输入框',
									duration: 5000,
								});
								gettingSmiles.value = false;
							});
						} else {
							ElMessage({
								type: 'info',
								message: '请在画板中点击"Copy"按钮复制 SMILES，然后粘贴到下方输入框',
								duration: 5000,
							});
							gettingSmiles.value = false;
						}
					} catch (error) {
						ElMessage({
							type: 'info',
							message: '请在画板中点击"Copy"按钮复制 SMILES，然后粘贴到下方输入框',
							duration: 5000,
						});
						gettingSmiles.value = false;
					}
					if (messageHandler) {
						window.removeEventListener('message', messageHandler);
						messageHandler = null;
					}
				}
			}, 2000);
		} catch (error) {
			ElMessage({
				type: 'warning',
				message: '无法自动获取 SMILES，请手动从画板复制',
			});
			gettingSmiles.value = false;
		}
	} else {
		ElMessage({
			type: 'info',
			message: '画板尚未加载完成，请稍后再试',
		});
		gettingSmiles.value = false;
	}
};

const handleConfirmSmiles = () => {
	if (tempSmiles.value.trim()) {
		form.smiles = tempSmiles.value.trim();
		ElMessage({
			type: 'success',
			message: `SMILES 已应用: ${form.smiles}`,
		});
		ketcherDialogVisible.value = false;
	} else {
		ElMessage({
			type: 'warning',
			message: '请输入或获取 SMILES 字符串',
		});
	}
};

const handlePredict = async () => {
    if (!form.smiles.trim()) {
        ElMessage.warning('请输入 SMILES 字符串后再进行预测');
        return;
    }

    if (loading.value) return;
    
    resetLoading();
    loading.value = true;

    try {
        const postData = {
            // 将 id 转为 integer，smiles 去空格，包含新增的两个参数
            id: parseInt(localStorage.getItem('userId') || '100'),
            smiles: form.smiles.trim(),
            iterations: form.iterations,
            expansion_topk: form.expansion_topk
        };

        const response = await axios.post('/api/system/task/add/', postData);

        if (response.status === 200) {
            ElMessage.success('任务已成功创建并加入后台检测队列');
						form.smiles="";
        } else {
            throw new Error('接口响应异常');
        }
    } catch (error: any) {
        console.error('提交失败:', error);
        ElMessage.error(error.response?.data?.message || '提交失败，请稍后重试');
    } finally {
        loading.value = false;
    }
};

watch(
	() => route.fullPath,
	() => {
		resetLoading();
	}
);

onBeforeUnmount(() => {
	if (timer.value) clearTimeout(timer.value);
	// 清理消息监听器
	if (messageHandler) {
		window.removeEventListener('message', messageHandler);
		messageHandler = null;
	}
});
</script>

<style scoped lang="scss">
.retro-page {
	display: flex;
	flex-direction: column;
	gap: 20px;
	padding: 18px;
	background: linear-gradient(135deg, rgba(76, 125, 255, 0.08), rgba(255, 255, 255, 0.9));
	min-height: calc(100vh - 120px);
	--retro-accent: var(--el-color-primary);

	.retro-hero {
		border: none;
		background: #fff;
	}
}

.retro-hero__content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 24px;
}

.retro-hero__eyebrow {
	font-size: 13px;
	font-weight: 600;
	color: var(--retro-accent);
	text-transform: uppercase;
	letter-spacing: 0.08em;
	margin-bottom: 8px;
}

.retro-hero__title {
	font-size: 26px;
	margin: 0;
	color: var(--el-text-color-primary);
}

.retro-hero__description {
	margin: 10px 0 18px;
	color: var(--el-text-color-secondary);
	font-size: 14px;
	line-height: 1.6;
	max-width: 560px;
}

.retro-hero__tag {
	border: none;
	background: var(--retro-accent);
	color: #fff;
	font-size: 13px;
}

.retro-form-card {
	border: none;
	
	.card-header {
		.card-title {
			font-size: 20px;
			font-weight: 600;
			color: var(--el-text-color-primary);
		}
	}
}

.smiles-input {
	:deep(.el-textarea__inner) {
		font-family: 'Courier New', monospace;
		font-size: 14px;
		line-height: 1.6;
		resize: none !important;
	}
}

.form-label {
	display: flex;
	align-items: center;
	gap: 6px;
	font-weight: 500;
}

.form-tip {
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 12px;
	color: var(--el-text-color-secondary);
	margin-top: 4px;
	
	.el-icon {
		font-size: 14px;
		color: var(--el-color-info);
	}
}

.input-stats {
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 6px 12px;
	background: var(--el-bg-color-page);
	border-radius: 6px;
	margin-bottom: 10px;
	
	.stat-item {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		
		.stat-icon {
			font-size: 14px;
			color: var(--el-color-primary);
		}
		
		.stat-label {
			color: var(--el-text-color-regular);
		}
		
		.stat-value {
			font-weight: 600;
			color: var(--el-text-color-primary);
			
			&.stat-success {
				color: var(--el-color-success);
			}
			
			&.stat-empty {
				color: var(--el-text-color-placeholder);
			}
		}
	}
}

.parameter-config {
  background: linear-gradient(135deg, rgba(76, 125, 255, 0.05), rgba(255, 255, 255, 0.8));
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 10px;
  
  .config-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-bottom: 10px;
    
    .el-icon {
      font-size: 14px;
      color: var(--el-color-primary);
    }
  }
  
  .config-content {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: center;
  }
  
  .config-item {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .config-label {
      font-size: 13px;
      color: var(--el-text-color-regular);
      white-space: nowrap;
    }

    :deep(.el-input-number--small) {
      width: 100px;
    }
  }
}


.quick-examples {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 10px;
	padding: 6px 12px;
	background: var(--el-bg-color-page);
	border-radius: 6px;
	flex-wrap: wrap;
	
	.quick-examples-label {
		font-size: 13px;
		color: var(--el-text-color-regular);
		white-space: nowrap;
		font-weight: 500;
	}
}


.retro-form__hint {
	color: var(--el-text-color-secondary);
	font-size: 14px;
}

.retro-cards-row {
	align-items: stretch;
	
	.retro-card-col {
		display: flex;
		align-items: stretch;
		
		.el-card {
			width: 100%;
			display: flex;
			flex-direction: column;
			height: 100%;
		}
	}
}

.retro-form {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	
	:deep(.el-form-item) {
		margin-bottom: 12px;
		
		&:last-child {
			margin-bottom: 0;
		}
	}
	
	.retro-form__actions {
		margin-top: 10px;
		padding-top: 10px;
		border-top: 1px solid var(--el-border-color-lighter);
	}
}

.retro-form-card,
.info-card {
	display: flex !important;
	flex-direction: column;
	height: 100% !important;
	
	:deep(.el-card__header) {
		flex-shrink: 0;
		padding: 10px 20px;
	}
	
	:deep(.el-card__body) {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
		padding: 10px 20px;
	}
}

.ketcher-dialog {
	:deep(.el-dialog) {
		height: 96vh !important;
		max-height: 96vh !important;
		display: flex !important;
		flex-direction: column !important;
		margin: 0 !important;
	}
	
	:deep(.el-dialog__header) {
		flex-shrink: 0 !important;
		padding: 20px 20px 10px !important;
		border-bottom: 1px solid var(--el-border-color-lighter);
	}
	
	:deep(.el-dialog__body) {
		padding: 0 !important;
		flex: 1 1 auto !important;
		overflow: hidden !important;
		height: auto !important;
		max-height: none !important;
		min-height: 0 !important;
		display: flex !important;
		flex-direction: column !important;
	}
	
	:deep(.el-dialog__footer) {
		flex-shrink: 0 !important;
		padding: 15px 20px !important;
		border-top: 1px solid var(--el-border-color-lighter);
	}
}

.ketcher-container {
	width: 100%;
	height: 100%;
	position: relative;
	background: #fff;
}

.ketcher-iframe {
	width: 100%;
	height: 100%;
	border: none;
	display: block;
}

.ketcher-dialog-footer {
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding: 0 !important;
}

.ketcher-smiles-input {
	width: 100%;
	margin-bottom: 8px;
}

.ketcher-dialog-buttons {
	display: flex;
	justify-content: flex-end;
	gap: 12px;
	width: 100%;
}

// 右侧信息卡片样式
.info-card {
	border: none;
	margin-bottom: 20px;
	
	.info-card-header {
		display: flex;
		align-items: center;
		gap: 8px;
		font-weight: 600;
		font-size: 20px;
		color: var(--el-text-color-primary);
	}
	
}

.tips-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 4px;
	
	.tip-alert {
		margin-bottom: 0 !important;
		
		:deep(.el-alert__content) {
			padding: 6px 0;
		}
	}
	
	.tip-item {
		font-size: 13px;
		line-height: 1.4;
	}
}

.retro-form-card {
	min-height: 300px;
}

@media (max-width: 768px) {
	.retro-hero__content {
		flex-direction: column;
		align-items: flex-start;
	}

	.retro-form__actions {
		flex-direction: column;
		align-items: flex-start;
	}
	
	.quick-examples {
		flex-direction: column;
		align-items: flex-start;
		
		.quick-examples-label {
			margin-bottom: 8px;
		}
	}
}
</style>

<!-- 全局样式，用于覆盖 Element Plus 的默认样式 -->
<style lang="scss">
.ketcher-dialog-modal {
	.el-overlay-dialog {
		display: flex !important;
		align-items: flex-start !important;
		justify-content: center !important;
		padding-top: 2vh !important;
		
		.el-dialog {
			height: 96vh !important;
			max-height: 96vh !important;
			display: flex !important;
			flex-direction: column !important;
			margin: 0 !important;
		}
	}
	
	.el-dialog__body {
		padding: 0 !important;
		flex: 1 1 auto !important;
		overflow: hidden !important;
		height: auto !important;
		max-height: none !important;
		min-height: 0 !important;
		display: flex !important;
		flex-direction: column !important;
	}
}
</style>

