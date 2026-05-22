import { request } from '/@/utils/service';
import { PageQuery, InfoReq } from '@fast-crud/fast-crud';
import { mockGetAnnouncementList, mockGetAnnouncementDetail } from './mockData';

export const apiPrefix = '/api/system/announcement/';

/**
 * 是否使用本地模拟数据
 * 设置为 true：始终使用本地模拟数据（用于开发测试）
 * 设置为 false：优先使用真实接口，失败时自动回退到本地数据
 */
const USE_MOCK_DATA = true; // 临时设置为 true 用于测试

/**
 * 获取公告列表（查看模式，默认只获取已发布的公告）
 */
export async function GetAnnouncementList(query: PageQuery) {
	// 如果没有指定状态或状态为空，默认只获取已发布的公告
	const params: any = { ...query };
	// 只有当 status 为 undefined、null 或空字符串时，才默认设置为 published
	if (params.status === undefined || params.status === null || params.status === '') {
		params.status = 'published';
	}
	
	// 如果使用模拟数据，直接返回本地数据
	if (USE_MOCK_DATA) {
		const mockData = mockGetAnnouncementList(params);
		console.log('🔵 [模拟数据] 返回格式:', JSON.stringify(mockData, null, 2));
		console.log('🔵 [模拟数据] data 类型:', Array.isArray(mockData.data) ? '数组' : typeof mockData.data);
		console.log('🔵 [模拟数据] data 长度:', Array.isArray(mockData.data) ? mockData.data.length : '不是数组');
		return Promise.resolve(mockData);
	}
	
	// 尝试调用真实接口，失败时使用本地数据
	try {
		const response = await request({
			url: apiPrefix,
			method: 'get',
			params,
		});
		console.log('🟢 [真实接口] 返回:', response);
		return response;
	} catch (error: any) {
		// 接口调用失败，使用本地模拟数据
		console.warn('⚠️ 接口调用失败，使用本地模拟数据:', error);
		const mockData = mockGetAnnouncementList(params);
		console.log('🔵 [回退模拟数据] 返回:', mockData);
		return mockData;
	}
}

/**
 * 获取公告详情
 */
export async function GetAnnouncementDetail(id: InfoReq) {
	const idValue = typeof id === 'object' ? (id as any).id || id : id;
	
	// 如果使用模拟数据，直接返回本地数据
	if (USE_MOCK_DATA) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(mockGetAnnouncementDetail(idValue));
			}, 200); // 模拟网络延迟
		});
	}
	
	// 尝试调用真实接口，失败时使用本地数据
	try {
		const response = await request({
			url: apiPrefix + idValue + '/',
			method: 'get',
		});
		return response;
	} catch (error: any) {
		// 接口调用失败，使用本地模拟数据
		console.warn('接口调用失败，使用本地模拟数据:', error);
		return mockGetAnnouncementDetail(idValue);
	}
}

