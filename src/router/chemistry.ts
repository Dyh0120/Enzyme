export interface ChemistryMethodMeta {
	key: string;
	title: string;
	path: string;
	name: string;
	icon: string;
	eyebrow: string;
	description: string;
	accent: string;
	heroHint: string;
}

export const chemistryParentMeta = {
	path: '/chemistry-retrosynthesis',
	name: 'chemistryRetrosynthesis',
	title: '化学逆合成',
	icon: 'iconfont icon-ditu',
	slogan: 'AI 驱动的模板策略逆合成工作台',
};

export const chemistryResultsMeta = {
	path: '/chemistry-retrosynthesis/results',
	name: 'chemistryRetrosynthesisResults',
	title: '预测结果',
	icon: 'iconfont icon-zaosheng',
	description: '存档最近一次预测的 Top10 反应物候选及分子属性，便于对照与追踪。',
};

export const chemistryMethodMetas: ChemistryMethodMeta[] = [
	{
		key: 'fullClassic',
		title: '全模板法',
		path: '/chemistry-retrosynthesis/full-template',
		name: 'chemistryRetrosynthesisFull',
		icon: 'iconfont icon-wendu',
		eyebrow: 'Template Library · Classic',
		description: '基于完整片段的高精度模板匹配策略，适用于标准品与高通量筛选任务。',
		accent: '#4c7dff',
		heroHint: '推荐用于模板信息充足的体系',
	},
];

export const getChemistryMetaByKey = (key: string) =>
	chemistryMethodMetas.find((item) => item.key === key);

