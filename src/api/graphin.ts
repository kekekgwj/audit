import http from '@/utils/request';

export function getBodyGraphin() {
	return http({
		url: '/getBodyGraphin',
		method: 'get'
	});
}
