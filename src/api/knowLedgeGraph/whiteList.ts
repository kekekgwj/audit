import { appendQueryParams, get, post } from '@/utils/request';
const env = import.meta.env;
const { VITE_API_PREFIX: API_PREFIX } = env;
// 白名单列表
export function getWhiteList(data: any) {
	return get(
		appendQueryParams(
			API_PREFIX + '/blade-tool/graphAnalysis/getWhiteLists',
			data
		)
	);
}

//查询白名单类型列表
export function getWhiteListType() {
	return get(API_PREFIX + '/blade-tool/graphAnalysis/getWhiteListTypes');
}

// 根据类型获取表单配置项
export function getPrimaryProperties(data: any) {
	return get(
		appendQueryParams(
			API_PREFIX + '/blade-tool/graphAnalysis/getPrimaryProperties',
			data
		)
	);
}

//新增白名单
export function saveWhiteList(data: any) {
	return post(API_PREFIX + '/blade-tool/graphAnalysis/saveWhiteList', {
		...data
	});
}

//根据id获取白名单详情
export function getWhiteDetail(data: any) {
	return get(
		appendQueryParams(
			API_PREFIX + '/blade-tool/graphAnalysis/getWhiteList',
			data
		)
	);
}

//编辑白名单
export function updateWhiteList(data: any) {
	return post(API_PREFIX + '/blade-tool/graphAnalysis/updateWhiteList', {
		...data
	});
}

//删除白名单
export function deleteWhiteList(data: any) {
	return post(API_PREFIX + '/blade-tool/graphAnalysis/deleteWhiteList', {
		...data
	});
}
