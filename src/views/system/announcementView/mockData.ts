/**
 * 本地示例数据 - 用于接口不可用时的后备数据
 */
import { PageQuery } from '@fast-crud/fast-crud';

export interface MockAnnouncement {
	id: number;
	title: string;
	content: string;
	status: 'draft' | 'published' | 'offline';
	publish_time: string;
	creator: string;
	create_datetime: string;
	update_datetime: string;
}

// 本地示例数据列表
export const mockAnnouncements: MockAnnouncement[] = [
	{
		id: 1,
		title: '系统维护通知',
		content: '<p>尊敬的用户：</p><p>为了提供更好的服务体验，系统将于<strong>2024年1月15日 22:00-24:00</strong>进行例行维护升级。维护期间系统将暂停服务，给您带来的不便敬请谅解。</p><p>维护完成后，系统将恢复正常运行。如有紧急问题，请联系客服。</p><p>感谢您的理解与支持！</p>',
		status: 'published',
		publish_time: '2024-01-10 10:30:00',
		creator: '系统管理员',
		create_datetime: '2024-01-10 10:00:00',
		update_datetime: '2024-01-10 10:30:00',
	},
	{
		id: 2,
		title: '新功能上线公告',
		content: '<p>亲爱的用户：</p><p>我们很高兴地宣布，<strong>公告查看功能</strong>已经正式上线！</p><p><strong>新功能特点：</strong></p><ul><li>支持查看历史公告</li><li>支持按标题和状态筛选</li><li>支持分页浏览</li><li>支持查看公告详情</li></ul><p>欢迎体验新功能，如有任何建议或问题，欢迎反馈。</p>',
		status: 'published',
		publish_time: '2024-01-08 14:20:00',
		creator: '产品经理',
		create_datetime: '2024-01-08 14:00:00',
		update_datetime: '2024-01-08 14:20:00',
	},
	{
		id: 3,
		title: '安全更新提醒',
		content: '<p>重要通知：</p><p>为了保障您的账户安全，我们建议您：</p><ol><li>定期修改登录密码</li><li>启用双因素认证</li><li>不要在公共网络环境下登录系统</li><li>如发现异常登录，请立即联系管理员</li></ol><p>安全无小事，请大家务必重视！</p>',
		status: 'published',
		publish_time: '2024-01-05 09:15:00',
		creator: '安全管理员',
		create_datetime: '2024-01-05 09:00:00',
		update_datetime: '2024-01-05 09:15:00',
	},
	{
		id: 4,
		title: '春节假期安排通知',
		content: '<p>各位同事：</p><p>根据公司安排，<strong>2024年春节假期</strong>为：</p><p><strong>2月9日（除夕）至2月17日（正月初八）</strong>，共9天。</p><p>假期期间，系统将正常运行，但客服响应时间可能会有所延迟，敬请谅解。</p><p>祝大家春节快乐，阖家幸福！</p>',
		status: 'published',
		publish_time: '2024-01-03 16:45:00',
		creator: '人事部',
		create_datetime: '2024-01-03 16:30:00',
		update_datetime: '2024-01-03 16:45:00',
	},
	{
		id: 5,
		title: '数据备份提醒',
		content: '<p>系统提醒：</p><p>为了确保数据安全，系统已自动完成本周的数据备份。</p><p><strong>备份时间：</strong>每周日凌晨2:00</p><p><strong>备份内容：</strong>所有业务数据和用户信息</p><p><strong>备份保留期：</strong>30天</p><p>如有数据恢复需求，请联系系统管理员。</p>',
		status: 'published',
		publish_time: '2024-01-01 08:00:00',
		creator: '系统管理员',
		create_datetime: '2024-01-01 07:50:00',
		update_datetime: '2024-01-01 08:00:00',
	},
	{
		id: 6,
		title: '用户协议更新通知',
		content: '<p>尊敬的用户：</p><p>我们已更新了<strong>《用户服务协议》</strong>和<strong>《隐私政策》</strong>，主要更新内容包括：</p><ul><li>数据使用条款的明确说明</li><li>用户隐私保护措施</li><li>服务使用规范</li></ul><p>请您仔细阅读更新后的协议内容。继续使用我们的服务即表示您同意接受更新后的协议。</p><p>如有疑问，请联系客服。</p>',
		status: 'published',
		publish_time: '2023-12-28 11:20:00',
		creator: '法务部',
		create_datetime: '2023-12-28 11:00:00',
		update_datetime: '2023-12-28 11:20:00',
	},
	{
		id: 7,
		title: '系统性能优化完成',
		content: '<p>好消息：</p><p>系统性能优化工作已完成，主要改进包括：</p><ul><li>页面加载速度提升30%</li><li>数据库查询效率优化</li><li>接口响应时间缩短</li><li>系统稳定性增强</li></ul><p>现在您可以享受更流畅的使用体验了！</p>',
		status: 'published',
		publish_time: '2023-12-25 15:30:00',
		creator: '技术部',
		create_datetime: '2023-12-25 15:00:00',
		update_datetime: '2023-12-25 15:30:00',
	},
	{
		id: 8,
		title: '移动端APP上线',
		content: '<p>喜讯：</p><p>我们的<strong>移动端APP</strong>正式上线了！</p><p><strong>APP功能：</strong></p><ul><li>随时随地查看公告</li><li>实时接收通知</li><li>便捷的操作体验</li><li>支持离线查看</li></ul><p>扫描二维码即可下载，欢迎体验！</p>',
		status: 'published',
		publish_time: '2023-12-20 10:00:00',
		creator: '产品经理',
		create_datetime: '2023-12-20 09:30:00',
		update_datetime: '2023-12-20 10:00:00',
	},
	{
		id: 9,
		title: '培训课程通知',
		content: '<p>各位同事：</p><p>为提高大家的工作效率，公司将组织<strong>系统使用培训课程</strong>。</p><p><strong>培训时间：</strong>2024年1月20日 14:00-17:00</p><p><strong>培训地点：</strong>会议室A</p><p><strong>培训内容：</strong>系统功能介绍、操作演示、常见问题解答</p><p>请各部门安排相关人员参加，报名截止时间：1月18日。</p>',
		status: 'published',
		publish_time: '2023-12-15 14:30:00',
		creator: '培训部',
		create_datetime: '2023-12-15 14:00:00',
		update_datetime: '2023-12-15 14:30:00',
	},
	{
		id: 10,
		title: '系统升级完成',
		content: '<p>系统升级通知：</p><p>系统已成功升级至<strong>v2.0版本</strong>，新版本包含以下更新：</p><ul><li>全新的用户界面设计</li><li>新增公告查看功能</li><li>优化了系统性能</li><li>修复了已知问题</li><li>增强了系统安全性</li></ul><p>感谢您的支持，如有问题请及时反馈。</p>',
		status: 'published',
		publish_time: '2023-12-10 09:00:00',
		creator: '技术部',
		create_datetime: '2023-12-10 08:30:00',
		update_datetime: '2023-12-10 09:00:00',
	},
	{
		id: 11,
		title: '草稿测试公告',
		content: '<p>这是一个草稿状态的公告，用于测试。</p>',
		status: 'draft',
		publish_time: '',
		creator: '测试用户',
		create_datetime: '2024-01-12 10:00:00',
		update_datetime: '2024-01-12 10:00:00',
	},
	{
		id: 12,
		title: '已下线公告示例',
		content: '<p>这是一个已下线状态的公告示例。</p>',
		status: 'offline',
		publish_time: '2023-11-01 10:00:00',
		creator: '系统管理员',
		create_datetime: '2023-11-01 09:00:00',
		update_datetime: '2023-11-15 10:00:00',
	},
];

/**
 * 模拟分页查询
 */
export function mockGetAnnouncementList(query: PageQuery) {
	const { page, limit, title, status } = query as any;
	
	console.log('📋 [mockGetAnnouncementList] 查询参数:', { page, limit, title, status });
	console.log('📋 [mockGetAnnouncementList] 总数据量:', mockAnnouncements.length);
	
	// 过滤数据
	let filteredData = [...mockAnnouncements];
	
	// 按标题筛选
	if (title) {
		filteredData = filteredData.filter(item => 
			item.title.toLowerCase().includes(title.toLowerCase())
		);
	}
	
	// 按状态筛选
	// 如果 status 为 undefined、null 或空字符串，默认只显示已发布的
	if (status !== undefined && status !== null && status !== '') {
		filteredData = filteredData.filter(item => item.status === status);
	} else {
		// 默认只显示已发布的公告
		filteredData = filteredData.filter(item => item.status === 'published');
	}
	
	// 排序（按发布时间倒序）
	filteredData.sort((a, b) => {
		const timeA = a.publish_time || a.create_datetime;
		const timeB = b.publish_time || b.create_datetime;
		return new Date(timeB).getTime() - new Date(timeA).getTime();
	});
	
	// 分页
	const pageNum = page || 1;
	const pageSize = limit || 10;
	const start = (pageNum - 1) * pageSize;
	const end = start + pageSize;
	const pageData = filteredData.slice(start, end);
	
	console.log('📊 [mockGetAnnouncementList] 过滤后数据量:', filteredData.length);
	console.log('📊 [mockGetAnnouncementList] 分页参数:', { pageNum, pageSize, start, end });
	console.log('📊 [mockGetAnnouncementList] 分页后数据量:', pageData.length);
	console.log('📊 [mockGetAnnouncementList] 第一条数据:', pageData[0]);
	
	// 返回符合 fast-crud 格式的数据
	// 根据 settings.ts 中的 transformRes，fast-crud 期望 res.data 是数组
	// transformRes 会将其转换为 {records: res.data, currentPage: res.page, pageSize: res.limit, total: res.total}
	const result = {
		code: 2000,
		message: 'success',
		data: pageData, // data 直接是数组
		total: filteredData.length,
		page: pageNum,
		limit: pageSize,
	};
	
	console.log('✅ [mockGetAnnouncementList] 最终返回:', {
		code: result.code,
		dataLength: result.data.length,
		total: result.total,
		page: result.page,
		limit: result.limit,
	});
	
	return result;
}

/**
 * 模拟获取公告详情
 */
export function mockGetAnnouncementDetail(id: number | string) {
	const announcement = mockAnnouncements.find(item => item.id === Number(id));
	
	if (!announcement) {
		return {
			code: 404,
			message: '公告不存在',
			data: null,
		};
	}
	
	return {
		code: 2000,
		message: 'success',
		data: announcement,
	};
}

