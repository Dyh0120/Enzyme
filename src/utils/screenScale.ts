/**
 * 全站等比缩放适配
 * =====================================================
 * 设计基准：1430 × 725（用户电脑分辨率，设计图以此尺寸制作）
 * 方案：监听窗口宽度，按 clientWidth / 1430 对 <body> 设置 zoom，
 *       由浏览器对整站进行原生等比缩放：
 *   - 大屏（窗口 > 1430）：整体等比放大，避免大屏空旷
 *   - 小屏（窗口 < 1430）：整体等比缩小，避免内容溢出/挤压
 * 说明：缩放挂在 body 上，element-plus 的弹层（下拉/弹窗/消息等）
 *       会 teleport 到 body，因此也能跟随统一缩放，位置、尺寸一致。
 */
const DESIGN_WIDTH = 1430;

/** 当前浏览器是否支持 body zoom（Chrome/Edge/Safari 及 Firefox 126+ 支持） */
const supportsZoom = (): boolean =>
	typeof document !== 'undefined' && 'zoom' in document.body.style;

// zoom 为非标准属性，TS 的 CSSStyleDeclaration 未声明，这里做类型断言
const setBodyZoom = (scale: string): void => {
	(document.body.style as CSSStyleDeclaration & { zoom?: string }).zoom = scale;
};

let rafId: number | null = null;

/** 按当前窗口宽度计算缩放系数并应用 */
export const applyScreenScale = (): void => {
	if (!supportsZoom()) return;

	if (rafId !== null) cancelAnimationFrame(rafId);
	rafId = requestAnimationFrame(() => {
		const clientWidth = document.documentElement.clientWidth || window.innerWidth || DESIGN_WIDTH;
		const scale = clientWidth / DESIGN_WIDTH;
		setBodyZoom(scale.toFixed(4));
		// 暴露缩放系数，业务样式如需按比例微调可读取该 CSS 变量
		document.body.style.setProperty('--app-scale', scale.toFixed(4));
		rafId = null;
	});
};

/** 初始化：立即应用一次，并在窗口 resize 时重新计算 */
export const initScreenScale = (): void => {
	applyScreenScale();
	window.addEventListener('resize', applyScreenScale);
};
