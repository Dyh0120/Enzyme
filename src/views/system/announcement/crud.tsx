import * as api from './api';
import { dict, useCompute, PageQuery, AddReq, DelReq, EditReq, CreateCrudOptionsProps, CreateCrudOptionsRet } from '@fast-crud/fast-crud';
import { computed } from 'vue';
import { auth } from '/@/utils/authFunction';

export default function ({ crudExpose }: CreateCrudOptionsProps): CreateCrudOptionsRet {
	const pageRequest = async (query: PageQuery) => {
		return await api.GetList(query);
	};
	const editRequest = async ({ form, row }: EditReq) => {
		form.id = row.id;
		return await api.UpdateObj(form);
	};
	const delRequest = async ({ row }: DelReq) => {
		return await api.DelObj(row.id);
	};
	const addRequest = async ({ form }: AddReq) => {
		return await api.AddObj(form);
	};

	const viewRequest = async ({ row }: { row: any }) => {
		return await api.GetObj(row.id);
	};

	return {
		crudOptions: {
			request: {
				pageRequest,
				addRequest,
				editRequest,
				delRequest,
			},
			actionbar: {
				buttons: {
					add: {
						show: true, // 暂时显示，如果后端有权限控制再改回 auth('announcement:Create')
					},
				},
			},
			rowHandle: {
				fixed: 'right',
				width: 200,
				buttons: {
					view: {
						text: '查看',
						type: 'text',
						iconRight: 'View',
						show: true, // 暂时显示，如果后端有权限控制再改回 auth('announcement:Search')
						click({ index, row }) {
							crudExpose.openView({ index, row });
						},
					},
					edit: {
						text: '编辑',
						type: 'text',
						iconRight: 'Edit',
						show: true, // 暂时显示，如果后端有权限控制再改回 auth('announcement:Update')
					},
					remove: {
						text: '删除',
						iconRight: 'Delete',
						type: 'text',
						show: true, // 暂时显示，如果后端有权限控制再改回 auth('announcement:Delete')
					},
				},
			},
			columns: {
				id: {
					title: 'ID',
					type: 'number',
					form: {
						show: false,
					},
					column: {
						width: 80,
					},
				},
				title: {
					title: '公告标题',
					type: 'text',
					search: {
						show: true,
					},
					column: {
						minWidth: 200,
					},
					form: {
						rules: [
							{
								required: true,
								message: '请输入公告标题',
							},
						],
					},
				},
				content: {
					title: '公告内容',
					type: ['editor-wang5', 'colspan'],
					form: {
						rules: [
							{
								required: true,
								message: '请输入公告内容',
							},
						],
						component: {
							disabled: false,
							id: 'announcement-editor',
							editorConfig: {
								readOnly: false,
							},
							uploader: {
								type: 'form',
								buildUrl(res: any) {
									return res.url;
								},
							},
						},
					},
					column: {
						show: false,
					},
				},
				status: {
					title: '状态',
					type: 'dict-select',
					dict: dict({
						data: [
							{ label: '草稿', value: 'draft' },
							{ label: '已发布', value: 'published' },
							{ label: '已下线', value: 'offline' },
						],
					}),
					search: {
						show: true,
					},
					form: {
						value: 'draft',
						rules: [
							{
								required: true,
								message: '请选择状态',
							},
						],
					},
					column: {
						width: 120,
					},
				},
				publish_time: {
					title: '发布时间',
					type: 'datetime',
					form: {
						show: false,
					},
					column: {
						width: 180,
					},
				},
				creator: {
					title: '创建人',
					type: 'text',
					form: {
						show: false,
					},
					column: {
						width: 120,
					},
				},
				create_datetime: {
					title: '创建时间',
					type: 'datetime',
					form: {
						show: false,
					},
					column: {
						width: 180,
					},
				},
				update_datetime: {
					title: '更新时间',
					type: 'datetime',
					form: {
						show: false,
					},
					column: {
						width: 180,
					},
				},
			},
		},
	};
}

