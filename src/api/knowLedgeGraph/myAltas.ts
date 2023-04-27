import http from '@/utils/request';

export function getMyAltasList() {
	return http({
		url: '/myAltasList',
		method: 'get'
	});
}
