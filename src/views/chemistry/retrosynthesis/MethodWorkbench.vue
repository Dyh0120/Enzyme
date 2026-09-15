<template>
	<div class="retro-page">
		<el-card class="retro-hero" shadow="never">
			<div class="retro-hero__content">
				<div>
					<p class="retro-hero__eyebrow">Enzyme Optimization · AI Powered</p>
					<h1 class="retro-hero__title">酶优化计算工作平台</h1>
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
							<span class="card-title">参数输入</span>
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
								placeholder="请输入酶的氨基酸序列（最多1000个字符）"
								clearable
								:resize="'none'"
								class="sequence-input"
								maxlength="1000"
								show-word-limit
							/>
						</el-form-item>
						
						<el-form-item label="PDB 文件">
							<template #label>
								<span class="form-label">
									<el-icon><ele-Upload /></el-icon>
									PDB 文件
								</span>
							</template>
							<div class="pdb-upload-wrapper">
								<el-upload
									ref="pdbUpload"
									:limit="1"
									:show-file-list="false"
									:on-change="handlePdbChange"
									:on-remove="handlePdbRemove"
									:before-upload="beforePdbUpload"
									:auto-upload="false"
									accept=".pdb"
								>
									<el-button type="primary">选择 PDB 文件</el-button>
								</el-upload>
								<div v-if="pdbFile" class="pdb-file-info">
									<el-icon><ele-Document /></el-icon>
									<span class="pdb-filename">{{ pdbFile.name }}</span>
									<el-icon class="pdb-remove" @click="handleRemovePdb"><ele-Close /></el-icon>
								</div>
							</div>
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
						</el-form-item>
						
						<el-form-item label="底物信息">
							<template #label>
								<span class="form-label">
									<el-icon><ele-Connection /></el-icon>
									底物信息
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
						</el-form-item>

						<el-form-item label="优化目标">
							<template #label>
								<span class="form-label">
									<el-icon><ele-Setting /></el-icon>
									优化目标
								</span>
							</template>
							<el-checkbox-group v-model="predictionTypes" class="prediction-type-group">
								<el-checkbox
									v-for="item in predictionTypeOptions"
									:key="item.value"
									:label="item.value"
									:value="item.value"
									border
								>
									{{ item.label }}
								</el-checkbox>
							</el-checkbox-group>
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
							<el-button type="primary" size="large" plain @click="handleLoadExample">
								<template #icon>
									<el-icon>
										<ele-Document />
									</el-icon>
								</template>
								加载示例
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
											<strong>序列信息：</strong>输入酶的氨基酸序列
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
											<strong>PDB 文件：</strong>上传酶的三维结构文件
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
						<span v-if="ketcherLoading" style="color:#909399;font-size:12px;margin-right:8px;">画板加载中…</span>
						<el-button @click="handleGetSmiles" :loading="gettingSmiles">获取 SMILES</el-button>
						<el-button type="primary" @click="handleConfirmSmiles">确认并应用</el-button>
						<el-button @click="ketcherDialogVisible = false">关闭</el-button>
					</div>
				</div>
			</template>
		</el-dialog>

		<!-- 序列/参数校验警示弹窗（居中模态） -->
		<teleport to="body">
			<transition name="enzyme-alert-fade">
				<div v-if="centerAlert.visible" class="enzyme-alert-mask" @click.self="closeCenterAlert">
					<div class="enzyme-alert" role="alertdialog" aria-modal="true">
						<div class="enzyme-alert__header">
							<el-icon class="enzyme-alert__icon"><ele-CloseBold /></el-icon>
							<span class="enzyme-alert__title">{{ centerAlert.title }}</span>
						</div>
						<div class="enzyme-alert__body">{{ centerAlert.message }}</div>
						<div class="enzyme-alert__footer">
							<button type="button" class="enzyme-alert__confirm" @click="closeCenterAlert">确定</button>
						</div>
					</div>
				</div>
			</transition>
		</teleport>
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
const predictionTypes = ref<string[]>([]);

const predictionTypeOptions = [
  { label: '活性', value: 'activity' },
  { label: '热稳定性', value: 'stability' },
  { label: '表达量', value: 'expression' },
  { label: '可溶性', value: 'solubility' },
  { label: '疏水性', value: 'hydrophobicity' },
];

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

// Ketcher 就绪状态：iframe 的 load 事件 ≠ Ketcher 应用初始化完成，
// 需要通过轮询 iframe 内的 ketcher 实例来判定真正的就绪
const ketcherLoading = ref(false);

// 轮询等待 Ketcher 就绪；resolve(true)=已就绪，false=超时
const whenKetcherReady = (timeoutMs = 30000): Promise<boolean> => {
	return new Promise((resolve) => {
		const start = Date.now();
		const check = () => {
			const win: any = ketcherIframe.value?.contentWindow;
			if (win && win.ketcher && typeof win.ketcher.getSmiles === 'function') {
				ketcherReady.value = true;
				ketcherLoading.value = false;
				resolve(true);
				return;
			}
			if (Date.now() - start >= timeoutMs) {
				ketcherLoading.value = false;
				resolve(false);
				return;
			}
			setTimeout(check, 300);
		};
		check();
	});
};

const handleKetcherLoad = () => {
	// iframe 文档已加载，但 Ketcher 应用可能仍在初始化：开始轮询就绪
	ketcherReady.value = false;
	ketcherLoading.value = true;
	whenKetcherReady();
};

const handleKetcherClose = () => {
	if (messageHandler) {
		window.removeEventListener('message', messageHandler);
		messageHandler = null;
	}
	ketcherReady.value = false;
	ketcherLoading.value = false;
};

let messageHandler: ((event: MessageEvent) => void) | null = null;

const handleGetSmiles = async () => {
	gettingSmiles.value = true;
	
	// 等待 Ketcher 真正就绪后再获取，避免过早点击时误报“未加载”
	await whenKetcherReady(30000);
	if (ketcherIframe.value?.contentWindow) {
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
			message: '画板正在加载中，请稍候再试',
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

// 校验文件名后缀是否为 .pdb（大小写不敏感）
const isPdbFile = (name: string): boolean => /\.pdb$/i.test(name ?? '');

const handlePdbChange = (file: any) => {
	const raw = file?.raw;
	// 校验文件后缀必须为 .pdb
	if (!raw || !isPdbFile(raw.name)) {
		showCenterAlert('只支持 .pdb 后缀的文件，请重新选择', '文件校验不通过');
		pdbFile.value = null;
		if (pdbUpload.value) {
			pdbUpload.value.clearFiles();
		}
		return;
	}
	pdbFile.value = raw;
	ElMessage.success('PDB 文件已选择');
};

const handlePdbRemove = () => {
	pdbFile.value = null;
	pdbUuid.value = '';
};

const handleRemovePdb = () => {
	pdbFile.value = null;
	pdbUuid.value = '';
	if (pdbUpload.value) {
		pdbUpload.value.clearFiles();
	}
};

const beforePdbUpload = (file: File) => {
	// 上传前校验后缀必须为 .pdb
	if (!isPdbFile(file?.name)) {
		showCenterAlert('只支持 .pdb 后缀的文件，请重新选择', '文件校验不通过');
		return false;
	}
	return true;
};

const uploadPdbFile = async (): Promise<string> => {
	if (!pdbFile.value) {
		throw new Error('请选择 PDB 文件');
	}
	// 提交前再次校验后缀必须为 .pdb
	if (!isPdbFile(pdbFile.value.name)) {
		throw new Error('PDB 文件后缀必须为 .pdb，请重新选择');
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

// 20 种标准氨基酸大写单字母
const STANDARD_AMINO_ACIDS = 'ARNDCQEGHILKMFPSTWYV';

/**
 * 校验序列信息
 * 规则：只允许 20 种标准氨基酸大写单字母；必须全大写（小写直接非法）；
 *       不能包含空格、数字、换行、X/B/Z/* 等非标准字符；空字符串直接报错。
 * @returns 合法返回空字符串，非法返回对应错误提示
 */
const validateSequence = (raw: string): string => {
	const seq = raw ?? '';
	if (!seq.trim()) {
		return '请输入序列信息';
	}
	// 空格、制表符、换行等空白字符一律非法
	if (/\s/.test(seq)) {
		return '序列信息不能包含空格或换行，请输入连续的氨基酸单字母序列';
	}
	// 只允许 20 种标准氨基酸大写单字母
	if (!new RegExp(`^[${STANDARD_AMINO_ACIDS}]+$`).test(seq)) {
		// 区分“含小写字母”与“含其他非法字符”，给出更明确的提示
		if (/[a-z]/.test(seq)) {
			return '序列信息必须使用大写字母，检测到小写字母，请全部改为大写';
		}
		return '序列信息只能包含 20 种标准氨基酸大写单字母（A,R,N,D,C,Q,E,G,H,I,L,K,M,F,P,S,T,W,Y,V），不能包含数字、X/B/Z/* 等非标准字符';
	}
	return '';
};

// SMILES 语法校验用常量
const SMILES_ORGANIC_ATOMS = ['B', 'C', 'N', 'O', 'P', 'S', 'F', 'I', 'b', 'c', 'n', 'o', 'p', 's'];
const SMILES_TWO_LETTER_ATOMS = ['Cl', 'Br'];
const SMILES_INVALID_START = new Set([')', ']', '(', '=', '#', '-', ':', '.', '/', '\\']);
const SMILES_INVALID_END = new Set(['(', '[', '=', '#', '-', ':', '.', '/', '\\']);

/**
 * 校验底物信息（SMILES 格式）：语法级校验
 * 规则：只允许 SMILES 语法字符；圆/方括号配对；环闭合编号成对；方括号外只允许有机子集原子；首尾字符合法。
 * @returns 合法返回空字符串，非法返回对应错误提示
 */
const validateSmiles = (raw: string): string => {
	const s = (raw ?? '').trim();
	if (!s) {
		return '请输入底物信息 (SMILES)';
	}
	if (/\s/.test(s)) {
		return 'SMILES 格式不正确：不能包含空格或换行';
	}
	// 只允许 SMILES 语法字符
	if (!/^[A-Za-z0-9@+\-\[\]()\\\/%=#\$:.*]+$/.test(s)) {
		return 'SMILES 格式不正确：含有非法字符，请输入合法的 SMILES 结构式';
	}
	// 括号配对 + 环闭合编号（方括号内为同位素/电荷等，不参与统计）
	const stack: string[] = [];
	const ring: Record<string, number> = {};
	let bracket = 0;
	for (let i = 0; i < s.length; i++) {
		const ch = s[i];
		if (ch === '[') {
			bracket++;
			stack.push('[');
			continue;
		}
		if (ch === ']') {
			if (stack.pop() !== '[') return 'SMILES 格式不正确：方括号不匹配';
			bracket--;
			continue;
		}
		if (ch === '(') {
			stack.push('(');
			continue;
		}
		if (ch === ')') {
			if (stack.pop() !== '(') return 'SMILES 格式不正确：圆括号不匹配';
			continue;
		}
		if (bracket > 0) continue;
		// 原子符号（方括号外只允许有机子集原子）
		if (/[A-Za-z]/.test(ch)) {
			const two = s.slice(i, i + 2);
			if (SMILES_TWO_LETTER_ATOMS.includes(two)) {
				i++;
				continue;
			}
			if (!SMILES_ORGANIC_ATOMS.includes(ch)) return `SMILES 格式不正确：非法原子符号 "${ch}"`;
			continue;
		}
		// 环闭合编号
		if (ch === '%') {
			const num = s.slice(i + 1, i + 3);
			if (!/^[0-9]{2}$/.test(num)) return 'SMILES 格式不正确：环闭合编号应为 % 加两位数字';
			ring['%' + num] = (ring['%' + num] || 0) + 1;
			i += 2;
			continue;
		}
		if (/[0-9]/.test(ch)) {
			ring[ch] = (ring[ch] || 0) + 1;
			continue;
		}
	}
	if (stack.length) return 'SMILES 格式不正确：括号不匹配';
	for (const key in ring) {
		if (ring[key] % 2 !== 0) return `SMILES 格式不正确：环闭合编号 "${key}" 未成对闭合`;
	}
	// 首尾字符结构检查
	if (SMILES_INVALID_START.has(s[0])) return 'SMILES 格式不正确：起始字符非法';
	if (SMILES_INVALID_END.has(s[s.length - 1])) return 'SMILES 格式不正确：结束字符非法';
	return '';
};

// 警示错误弹窗状态
const centerAlert = reactive({
	visible: false,
	title: '校验不通过',
	message: '',
});

// 弹窗式校验提醒：居中模态弹窗（深红标题条 + 确定按钮）
const showCenterAlert = (message: string, title = '校验不通过') => {
	centerAlert.title = title;
	centerAlert.message = message;
	centerAlert.visible = true;
};

// 关闭弹窗
const closeCenterAlert = () => {
	centerAlert.visible = false;
};

const handleSubmit = async () => {
	// 校验序列信息
	const sequenceError = validateSequence(form.sequence);
	if (sequenceError) {
		showCenterAlert(sequenceError, '序列校验不通过');
		return;
	}

	// 检查序列长度
	if (form.sequence.trim().length > 1000) {
		showCenterAlert('序列长度不能超过1000个字符', '序列校验不通过');
		return;
	}

	if (!pdbFile.value) {
		showCenterAlert('请上传 PDB 文件');
		return;
	}

	const pocketSites = parsePocketSites();
	if (pocketSites.length === 0) {
		showCenterAlert('请输入位点信息');
		return;
	}

	const smilesError = validateSmiles(form.smiles);
	if (smilesError) {
		showCenterAlert(smilesError, '底物信息校验不通过');
		return;
	}

	if (predictionTypes.value.length === 0) {
		showCenterAlert('请至少选择一种优化目标');
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
			pocket_sites: pocketSites,
			predict: predictionTypes.value
		};

		const response = await axios.post('/api/system/enzyme/task/create/', postData);

		if (response.data.code === 200) {
			ElMessage.success('任务已提交');
			form.sequence = '';
			form.smiles = '';
			pocketSitesInput.value = '';
			predictionTypes.value = [];
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
		showCenterAlert(error.message || '提交失败，请稍后重试', '提交失败');
	} finally {
		loading.value = false;
	}
};

const handleLoadExample = () => {
	form.sequence = 'MSENTFIFPATFMWGTSTSSYQIEGGTDEGGRTPSIWDTFCQIPGKVIGGDCGDVACDHFHHFKEDVQLMKQLGFLHYRFSVAWPRIMPAAGIINEEGLLFYEHLLDEIELAGLIPMLTLYHWDLPQWIEDEGGWTQRETIQHFKTYASVIMDRFGERINWWNTINEPYCASILGYGTGEHAPGHENWREAFTAAHHILMCHGIASNLHKEKGLTGKIGITLNMEHVDAASERPEDVAAAIRRDGFINRWFAEPLFNGKYPEDMVEWYGTYLNGLDFVQPGDMELIQQPGDFLGINYYTRSIIRSTNDASLLQVEQVHMEEPVTDMGWEIHPESFYKLLTRIEKDFSKGLPILITENGAAMRDELVNGQIEDTGRHGYIEEHLKACHRFIEEGGQLKGYFVWSFLDNFEWAWGYSKRFGIVHINYETQERTPKQSALWFKQMMAKNGF';
	form.smiles = 'O=[N+]([O-])c1ccc(O[C@@H]2O[C@H](CO)[C@@H](O)[C@H](O)[C@H]2O)cc1';
	pocketSitesInput.value = '154, 197, 300, 407';
	ElMessage.success('示例数据已加载');
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

.prediction-type-group {
	:deep(.el-checkbox-button),
	:deep(.el-checkbox) {
		margin-right: 4px;
	}

	:deep(.el-checkbox:last-child) {
		margin-right: 0;
	}
}

.sequence-input,
.smiles-input {
	:deep(.el-textarea__inner) {
		font-family: 'Courier New', monospace;
		font-size: 13px;
		line-height: 1.5;
		resize: none !important;
		padding-bottom: 24px !important;
	}

	:deep(.el-input__count) {
		bottom: 4px !important;
		right: 8px !important;
		background: rgba(255, 255, 255, 0.9) !important;
		padding: 2px 6px !important;
		border-radius: 4px !important;
		font-size: 12px !important;
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

.pdb-upload-wrapper {
	display: flex;
	align-items: center;
	gap: 12px;
	flex-wrap: wrap;
}

.pdb-file-info {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 6px 12px;
	background: var(--el-fill-color-light);
	border-radius: 6px;
	border: 1px solid var(--el-border-color-lighter);
	max-width: 400px;
	
	.el-icon:first-child {
		color: var(--el-color-primary);
		font-size: 16px;
	}
	
	.pdb-filename {
		flex: 1;
		font-size: 13px;
		color: var(--el-text-color-regular);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.pdb-remove {
		cursor: pointer;
		color: var(--el-text-color-secondary);
		font-size: 16px;
		transition: all 0.2s;
		
		&:hover {
			color: var(--el-color-danger);
			transform: scale(1.1);
		}
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
		margin-bottom: 2px;
		
		&:last-child {
			margin-bottom: 0;
		}
	}
	
	.retro-form__actions {
		margin-top: 2px;
		padding-top: 2px;
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

/* 序列/参数校验警示弹窗（居中模态、扁平科研风） */
.enzyme-alert-mask {
	position: fixed;
	inset: 0;
	z-index: 3000;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24px;
	background: rgba(17, 24, 39, 0.45);
}

.enzyme-alert {
	width: 460px;
	max-width: 100%;
	background: #ffffff;
	border-radius: 6px;
	overflow: hidden;
	box-shadow: 0 16px 48px rgba(0, 0, 0, 0.22);
}

.enzyme-alert__header {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 11px 18px;
	background: #c62828;
}

.enzyme-alert__icon {
	color: #ffffff;
	font-size: 16px;
}

.enzyme-alert__title {
	color: #ffffff;
	font-size: 15px;
	font-weight: 700;
	letter-spacing: 0.3px;
}

.enzyme-alert__body {
	padding: 22px 20px;
	color: #1f2937;
	font-size: 14px;
	line-height: 1.7;
	word-break: break-all;
}

.enzyme-alert__footer {
	display: flex;
	justify-content: flex-end;
	padding: 0 18px 16px;
}

.enzyme-alert__confirm {
	min-width: 88px;
	height: 34px;
	padding: 0 18px;
	border: none;
	border-radius: 4px;
	background: #d32f2f;
	color: #ffffff;
	font-size: 14px;
	cursor: pointer;
	transition: background 0.2s;
}

.enzyme-alert__confirm:hover {
	background: #b71c1c;
}

.enzyme-alert__confirm:active {
	background: #a01b16;
}

.enzyme-alert-fade-enter-active,
.enzyme-alert-fade-leave-active {
	transition: opacity 0.18s ease;
}

.enzyme-alert-fade-enter-from,
.enzyme-alert-fade-leave-to {
	opacity: 0;
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
