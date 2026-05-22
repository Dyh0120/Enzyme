import * as api from './api';
import { PageQuery, CreateCrudOptionsProps, CreateCrudOptionsRet } from '@fast-crud/fast-crud';

export default function ({ crudExpose }: CreateCrudOptionsProps): CreateCrudOptionsRet {
	const pageRequest = async (query: PageQuery) => {
		console.log('pageRequest 调用，参数:', query);
		const result = await api.GetAnnouncementList(query);
		console.log('pageRequest 返回结果:', result);
		return result;
	};

	const viewRequest = async ({ row }: { row: any }) => {
		return await api.GetAnnouncementDetail(row.id);
	};

	return {
		crudOptions: {
			request: {
				pageRequest,
				viewRequest,
				// 确保数据格式转换正确
				transformRes: ({ res }: any) => {
					console.log('🔄 [transformRes] 原始响应:', res);
					// 如果 res.data 是数组，说明格式正确
					if (Array.isArray(res.data)) {
						const result = {
							records: res.data,
							currentPage: res.page || 1,
							pageSize: res.limit || 10,
							total: res.total || 0,
						};
						console.log('🔄 [transformRes] 转换后:', result);
						return result;
					}
					// 如果格式不对，尝试其他方式
					console.warn('⚠️ [transformRes] 数据格式异常:', res);
					return {
						records: res.data?.list || res.data || [],
						currentPage: res.page || res.data?.page || 1,
						pageSize: res.limit || res.data?.limit || 10,
						total: res.total || res.data?.total || 0,
					};
				},
			},
			actionbar: {
				buttons: {
					add: {
						show: false, // 查看页面，不显示新增按钮
					},
				},
			},
			rowHandle: {
				fixed: 'right',
				width: 120,
				buttons: {
					edit: {
						show: false, // 不显示编辑按钮
					},
					remove: {
						show: false, // 不显示删除按钮
					},
					view: {
						text: '查看详情',
						type: 'text',
						iconRight: 'View',
						show: true,
						click({ index, row }) {
							crudExpose.openView({ index, row });
						},
					},
				},
			},
			search: {
				show: true,
				labelWidth: '100px',
				options: {
					size: 'default',
				},
			},
			pagination: {
				pageSize: 10, // 每页显示10条
				pageSizes: [10, 20, 30, 50, 100], // 可选择的每页显示条数
			},
			columns: {
				id: {
					title: 'ID',
					type: 'number',
					column: {
						width: 80,
					},
				},
				title: {
					title: '公告标题',
					type: 'text',
					search: {
						show: true,
						component: {
							placeholder: '请输入公告标题',
						},
					},
					column: {
						minWidth: 200,
						showOverflowTooltip: true,
					},
				},
				content: {
					title: '公告内容',
					type: ['editor-wang5', 'colspan'],
					column: {
						show: false, // 列表页不显示内容，详情页显示
					},
					form: {
						show: false,
					},
				},
				status: {
					title: '状态',
					type: 'dict-select',
					dict: {
						data: [
							{ label: '草稿', value: 'draft', color: 'info' },
							{ label: '已发布', value: 'published', color: 'success' },
							{ label: '已下线', value: 'offline', color: 'warning' },
						],
					},
					search: {
						show: true,
					},
					column: {
						width: 120,
					},
				},
				publish_time: {
					title: '发布时间',
					type: 'datetime',
					column: {
						width: 180,
						formatter: (context: any) => {
							if (context.row.publish_time) {
								return context.row.publish_time;
							}
							return '-';
						},
					},
				},
				creator: {
					title: '发布人',
					type: 'text',
					column: {
						width: 120,
					},
				},
				create_datetime: {
					title: '创建时间',
					type: 'datetime',
					column: {
						width: 180,
					},
				},
			},
		},
	};
}

