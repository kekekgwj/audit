import { appendQueryParams, get, post } from '@/utils/request';
const env = import.meta.env;
const { VITE_API_PREFIX: API_PREFIX } = env;

// 图谱列表
export function getMyAltasList(data: object) {
	return get(
		appendQueryParams(
			API_PREFIX + '/blade-tool/graphAnalysis/getMyGraphs',
			data
		)
	);
}

//删除
export function deleteGraph(data: any) {
	return post(API_PREFIX + '/blade-tool/graphAnalysis/deleteGraph', {
		...data
	});
}

//查看图谱
export function getDeatil(data: object) {
	return get(
		appendQueryParams(API_PREFIX + '/blade-tool/graphAnalysis/getMyGraph', data)
	);
}
