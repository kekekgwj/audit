import { appendQueryParams, get, post } from '@/utils/request';
import Cookies from 'js-cookie';
const env = import.meta.env;
const { VITE_API_PREFIX: API_PREFIX } = env;

// 查询数据列表
export function getIsAdmin() {
	return get(
		appendQueryParams(API_PREFIX + '/blade-tool/graphAnalysis/isAdmin')
	);
}

// 刷新token
interface RefreshTokenParams {
	tenantId: string;
	refresh_token: string;
}
export function refreshToken(data: RefreshTokenParams) {
	return post(API_PREFIX + '/blade-auth/oauth/token', undefined, {
		method: 'post',
		body: JSON.stringify({
			...data,
			grant_type: 'refresh_token',
			scope: 'all'
		}),
		headers: {
			'Content-Type': 'application/json',
			'Blade-Auth': `${Cookies.get('token')}`,
			'Tenant-Id': '000000'
		}
	});
}
