import { request } from '/@/utils/service';

export function getTaskList(query: any) {
	return request({
		url: '/api/system/task/list/',
		method: 'get',
		params: query,
	});
}

export function drawTask(data: { smiles: string }) {
	return request({
		url: '/api/system/task/draw/',
		method: 'post',
		data,
	});
}

export function deleteTask(data: { id: string; uuid: string }) {
	return request({
		url: '/api/system/task/delete/',
		method: 'post',
		data,
	});
}

export function startProcess(data: { id: string }) {
	return request({
		url: '/api/system/task/process/',
		method: 'post',
		data,
	});
}

export function shutdownProcess(data: { id: string; pid: number }) {
	return request({
		url: '/api/system/task/shutdown/',
		method: 'post',
		data,
	});
}

export function getTaskLogs(data: { uid: string }) {
	return request({
		url: '/api/system/task/logs/',
		method: 'post',
		data,
	});
}

export function getEnzymeTaskList(query: any) {
	return request({
		url: '/api/system/enzyme/task/list/',
		method: 'get',
		params: query,
	});
}

export function getEnzymeTaskDetail(taskUuid: string) {
	return request({
		url: `/api/system/enzyme/task/${taskUuid}/`,
		method: 'get',
	});
}

export function cancelEnzymeTask(data: { uuid: string }) {
	return request({
		url: '/api/system/enzyme/task/cancel/',
		method: 'get',
		params: data,
	});
}

export function deleteEnzymeTask(data: { uuid: string }) {
	return request({
		url: '/api/system/enzyme/task/delete/',
		method: 'post',
		data,
	});
}
