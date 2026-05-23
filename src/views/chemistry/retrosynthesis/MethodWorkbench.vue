<template>
	<div class="retro-page">
		<el-card class="retro-hero" shadow="never">
			<div class="retro-hero__content">
				<div>
					<p class="retro-hero__eyebrow">Enzyme Optimization · AI Powered</p>
					<h1 class="retro-hero__title">酶优化计算工作台</h1>
					<p class="retro-hero__description">
						基于序列信息、PDB 结构文件和底物 SMILES，通过 AI 模型进行酶活性位点优化计算。
					</p>
					<el-tag class="retro-hero__tag" effect="dark">
						AI 驱动的酶工程优化
					</el-tag>
				</div>
				<el-button type="primary" size="large" plain @click="handleOpenCanvas">
					<el-icon>
						<ele-MagicStick />
					</el-icon>
					绘制底物
				</el-button>
			</div>
		</el-card>

		<el-row :gutter="16" class="retro-cards-row">
			<!-- 左侧：主表单区域 -->
			<el-col :xs="24" :lg="18" class="retro-card-col">
				<el-card class="retro-form-card" shadow="hover">
					<template #header>
						<div class="card-header">
							<span class="card-title">酶优化参数输入</span>
						</div>
					</template>
					
					<el-form :model="form" class="retro-form">
						<el-form-item label="序列信息">
							<template #label>
								<span class="form-label">
									<el-icon><ele-Edit /></el-icon>
									序列信息
								</span>
							</template>
							<el-input
								v-model="form.sequence"
								type="textarea"
								:rows="5"
								placeholder="请输入酶的氨基酸序列（FASTA格式或纯字母序列）"
								clearable
								:resize="'none'"
								class="sequence-input"
							/>
							<div class="form-tip">
								<el-icon><ele-Info /></el-icon>
								<span>酶的氨基酸序列，结构建模和功能预测的基础</span>
							</div>
						</el-form-item>
						
						<el-form-item label="PDB 文件">
							<template #label>
								<span class="form-label">
									<el-icon><ele-Upload /></el-icon>
									PDB 文件
								</span>
							</template>
							<el-upload
								ref="pdbUpload"
								:limit="1"
								:show-file-list="true"
								:on-change="handlePdbChange"
								:on-remove="handlePdbRemove"
								:before-upload="beforePdbUpload"
								:auto-upload="false"
								accept=".pdb"
							>
								<el-button type="primary">选择 PDB 文件</el-button>
								<template #tip>
									<div class="form-tip">
										<el-icon><ele-Info /></el-icon>
										<span>提供酶的三维原子坐标结构文件</span>
									</div>
								</template>
							</el-upload>
							<el-progress v-if="uploadingPdb" :percentage="uploadProgress" style="margin-top: 10px;" />
						</el-form-item>
						
						<el-form-item label="位点信息">
							<template #label>
								<span class="form-label">
									<el-icon><ele-Position /></el-icon>
									位点信息
								</span>
							</template>
							<el-input
								v-model="pocketSitesInput"
								placeholder="请输入要优化的位点，多个位点用逗号分隔，例如：154, 197, 300, 407"
								clearable
							/>
							<div class="form-tip">
								<el-icon><ele-Info /></el-icon>
								<span>指定希望优化或变异的氨基酸位点位置</span>
							</div>
						</el-form-item>
						
						<el-form-item label="底物信息">
							<template #label>
								<span class="form-label">
									<el-icon><ele-Molecule /></el-icon>
									底物信息 (SMILES)
								</span>
							</template>
							<el-input
								v-model="form.smiles"
								type="textarea"
								:rows="3"
								placeholder="请输入底物的 SMILES 字符串，或点击上方按钮绘制底物结构"
								clearable
								:resize="'none'"
								class="smiles-input"
							/>
							<div class="form-tip">
								<el-icon><ele-Info /></el-icon>
								<span>底物分子结构的 SMILES 表示</span>
							</div>
						</el-form-item>
						
						<div class="retro-form__actions">
							<el-button type="success" size="large" :loading="loading" @click="handleSubmit">
								<template #icon>
									<el-icon>
										<ele-Guide />
									</el-icon>
								</template>
								{{ loading ? '正在提交…' : '提交任务' }}
							</el-button>
							<span v-if="loading" class="retro-form__hint">
								正在提交任务，请稍候...
							</span>
						</div>
					</el-form>
				</el-card>
			</el-col>
			
			<!-- 右侧：帮助信息区域 -->
			<el-col :xs="24" :lg="6" class="retro-card-col">
				<el-row :gutter="12" style="height: 100%;">
					<!-- 使用说明 -->
					<el-col :span="24" class="retro-card-col">
						<el-card class="info-card tips-card" shadow="hover">
							<template #header>
								<div class="info-card-header">
									<el-icon><ele-Lightbulb /></el-icon>
									<span>使用说明</span>
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
											<strong>序列信息：</strong>输入酶的氨基酸序列，FASTA 格式或纯字母序列均可
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
											<strong>PDB 文件：</strong>上传酶的三维结构文件，用于精修结构和能量计算
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
											<strong>位点信息：</strong>指定需要优化的氨基酸位置，多个位点用逗号分隔
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
											<strong>底物信息：</strong>输入底物的 SMILES，或点击绘制按钮使用可视化编辑器
										</div>
									</template>
								</el-alert>
							</div>
						</el-card>
					</el-col>
					
					<!-- 快速参考 -->
					<el-col :span="24" class="retro-card-col">
						<el-card class="info-card quick-ref-card" shadow="hover">
							<template #header>
								<div class="info-card-header">
									<el-icon><ele-Document /></el-icon>
									<span>快速参考</span>
								</div>
							</template>
							<div class="quick-ref-content">
								<div class="ref-item">
									<el-tag size="small" type="primary">SMILES</el-tag>
									<span>简化分子线性输入规范</span>
								</div>
								<div class="ref-item">
									<el-tag size="small" type="success">PDB</el-tag>
									<span>蛋白质数据库格式</span>
								</div>
								<div class="ref-item">
									<el-tag size="small" type="warning">FASTA</el-tag>
									<span>生物序列格式</span>
								</div>
								<div class="ref-divider"></div>
								<div class="ref-note">
									<el-icon><ele-InfoFilled /></el-icon>
									<span>提交后任务将在后台运行，完成后可在任务列表查看结果</span>
								</div>
							</div>
						</el-card>
					</el-col>
				</el-row>
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
import { onBeforeUnmount, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios'; 

const loading = ref(false);
const uploadingPdb = ref(false);
const uploadProgress = ref(0);
const ketcherDialogVisible = ref(false);
const ketcherIframe = ref<HTMLIFrameElement | null>(null);
const tempSmiles = ref('');
const gettingSmiles = ref(false);
const ketcherReady = ref(false);
const pdbUpload = ref<any>(null);
const pdbFile = ref<File | null>(null);
const pdbUuid = ref<string>('');
const pocketSitesInput = ref<string>('');

const form = reactive({
  sequence: '',
  smiles: '',
});

// Ketcher 画板 URL
const ketcherUrl = '/ketcher-standalone-v2.6.4/standalone/index.html';

const handleOpenCanvas = () => {
	ketcherDialogVisible.value = true;
	tempSmiles.value = form.smiles;
};

const handleKetcherLoad = () => {
	ketcherReady.value = true;
	if (ketcherIframe.value?.contentWindow) {
		try {
			const iframeDoc = ketcherIframe.value.contentDocument || ketcherIframe.value.contentWindow?.document;
			if (iframeDoc) {
				setTimeout(() => {
					injectKetcherMessageHandler();
				}, 2000);
			}
		} catch (error) {
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
	if (messageHandler) {
		window.removeEventListener('message', messageHandler);
		messageHandler = null;
	}
	ketcherReady.value = false;
};

let messageHandler: ((event: MessageEvent) => void) | null = null;

const handleGetSmiles = async () => {
	gettingSmiles.value = true;
	
	if (ketcherIframe.value?.contentWindow && ketcherReady.value) {
		try {
			if (messageHandler) {
				window.removeEventListener('message', messageHandler);
			}
			
			let timeoutId: ReturnType<typeof setTimeout> | null = null;
			let resolved = false;
			
			messageHandler = (event: MessageEvent) => {
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
			
			ketcherIframe.value.contentWindow.postMessage(
				{ type: 'getSmiles' },
				'*'
			);
			
			timeoutId = setTimeout(() => {
				if (!resolved) {
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

const handlePdbChange = (file: any) => {
	pdbFile.value = file.raw;
};

const handlePdbRemove = () => {
	pdbFile.value = null;
	pdbUuid.value = '';
};

const beforePdbUpload = (file: File) => {
	return true;
};

const uploadPdbFile = async (): Promise<string> => {
	if (!pdbFile.value) {
		throw new Error('请选择 PDB 文件');
	}

	uploadingPdb.value = true;
	uploadProgress.value = 0;

	const formData = new FormData();
	formData.append('file', pdbFile.value);

	try {
		const response = await axios.post('/api/system/enzyme/pdb/upload/', formData, {
			onUploadProgress: (progressEvent) => {
				if (progressEvent.total) {
					uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
				}
			}
		});

		if (response.data.code === 200) {
			ElMessage.success('PDB 文件上传成功');
			return response.data.data.uuid;
		} else {
			throw new Error(response.data.msg || '上传失败');
		}
	} catch (error: any) {
		console.error('PDB 上传失败:', error);
		throw new Error(error.response?.data?.msg || 'PDB 文件上传失败，请稍后重试');
	} finally {
		uploadingPdb.value = false;
		uploadProgress.value = 0;
	}
};

const parsePocketSites = (): number[] => {
	if (!pocketSitesInput.value.trim()) {
		return [];
	}
	return pocketSitesInput.value
		.split(',')
		.map(s => s.trim())
		.filter(s => s)
		.map(s => parseInt(s, 10))
		.filter(n => !isNaN(n));
};

const handleSubmit = async () => {
	if (!form.sequence.trim()) {
		ElMessage.warning('请输入序列信息');
		return;
	}

	if (!pdbFile.value) {
		ElMessage.warning('请上传 PDB 文件');
		return;
	}

	const pocketSites = parsePocketSites();
	if (pocketSites.length === 0) {
		ElMessage.warning('请输入位点信息');
		return;
	}

	if (!form.smiles.trim()) {
		ElMessage.warning('请输入底物信息 (SMILES)');
		return;
	}

	if (loading.value) return;

	loading.value = true;

	try {
		const uuid = await uploadPdbFile();
		pdbUuid.value = uuid;

		const postData = {
			sequence: form.sequence.trim(),
			smiles: form.smiles.trim(),
			pdb_uuid: pdbUuid.value,
			pocket_sites: pocketSites
		};

		const response = await axios.post('/api/system/enzyme/task/create/', postData);

		if (response.data.code === 200) {
			ElMessage.success('任务已提交');
			form.sequence = '';
			form.smiles = '';
			pocketSitesInput.value = '';
			if (pdbUpload.value) {
				pdbUpload.value.clearFiles();
			}
			pdbFile.value = null;
			pdbUuid.value = '';
		} else {
			throw new Error(response.data.msg || '提交失败');
		}
	} catch (error: any) {
		console.error('提交失败:', error);
		ElMessage.error(error.message || '提交失败，请稍后重试');
	} finally {
		loading.value = false;
	}
};

onBeforeUnmount(() => {
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
	gap: 12px;
	padding: 12px;
	background: linear-gradient(135deg, rgba(76, 125, 255, 0.08), rgba(255, 255, 255, 0.9));
	min-height: calc(100vh - 120px);

	.retro-hero {
		border: none;
		background: #fff;
	}
}

.sequence-input,
.smiles-input {
	:deep(.el-textarea__inner) {
		font-family: 'Courier New', monospace;
		font-size: 13px;
		line-height: 1.5;
		resize: none !important;
	}
}

.retro-hero__content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20px;
}

.retro-hero__eyebrow {
	font-size: 12px;
	font-weight: 600;
	color: #4c7dff;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	margin-bottom: 4px;
}

.retro-hero__title {
	font-size: 22px;
	margin: 0;
	color: var(--el-text-color-primary);
}

.retro-hero__description {
	margin: 6px 0 12px;
	color: var(--el-text-color-secondary);
	font-size: 13px;
	line-height: 1.5;
	max-width: 560px;
}

.retro-hero__tag {
	border: none;
	background: #4c7dff;
	color: #fff;
	font-size: 12px;
}

.retro-form-card {
	border: none;
	
	.card-header {
		.card-title {
			font-size: 16px;
			font-weight: 600;
			color: var(--el-text-color-primary);
		}
	}
}

.form-label {
	display: flex;
	align-items: center;
	gap: 6px;
	font-weight: 500;
	font-size: 14px;
}

.form-tip {
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 11px;
	color: var(--el-text-color-secondary);
	margin-top: 2px;
	
	.el-icon {
		font-size: 12px;
		color: var(--el-color-info);
	}
}

.retro-form__hint {
	color: var(--el-text-color-secondary);
	font-size: 13px;
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
		margin-bottom: 8px;
		
		&:last-child {
			margin-bottom: 0;
		}
	}
	
	.retro-form__actions {
		margin-top: 8px;
		padding-top: 8px;
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
		padding: 8px 16px;
	}
	
	:deep(.el-card__body) {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
		padding: 8px 16px;
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
		padding: 16px 16px 8px !important;
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
		padding: 12px 16px !important;
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
	gap: 10px;
	padding: 0 !important;
}

.ketcher-smiles-input {
	width: 100%;
	margin-bottom: 4px;
}

.ketcher-dialog-buttons {
	display: flex;
	justify-content: flex-end;
	gap: 10px;
	width: 100%;
}

.info-card {
	border: none;
	margin-bottom: 0;
	
	.info-card-header {
		display: flex;
		align-items: center;
		gap: 6px;
		font-weight: 600;
		font-size: 16px;
		color: var(--el-text-color-primary);
	}
}

.tips-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 3px;
	
	.tip-alert {
		margin-bottom: 0 !important;
		
		:deep(.el-alert__content) {
			padding: 4px 0;
		}
	}
	
	.tip-item {
		font-size: 12px;
		line-height: 1.4;
	}
}

.quick-ref-content {
	display: flex;
	flex-direction: column;
	gap: 8px;
	
	.ref-item {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
		color: var(--el-text-color-regular);
	}
	
	.ref-divider {
		height: 1px;
		background: var(--el-border-color-lighter);
		margin: 4px 0;
	}
	
	.ref-note {
		display: flex;
		align-items: flex-start;
		gap: 6px;
		font-size: 11px;
		color: var(--el-text-color-secondary);
		line-height: 1.5;
		
		.el-icon {
			color: var(--el-color-info);
			flex-shrink: 0;
			margin-top: 1px;
		}
	}
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

