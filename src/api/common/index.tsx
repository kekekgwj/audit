import { appendQueryParams, get, post } from '@/utils/request';
const env = import.meta.env;
const { VITE_API_PREFIX: API_PREFIX } = env;

// 查询数据列表
export function getIsAdmin() {
	return get(
		appendQueryParams(API_PREFIX + '/blade-tool/graphAnalysis/isAdmin')
	);
}

// 刷新token
export function refreshToken() {
	return post(API_PREFIX + '/blade-auth/oauth/token', {});
}
