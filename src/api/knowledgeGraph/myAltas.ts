import { appendQueryParams, get, post } from '@/utils/request';
const env = import.meta.env;
const { VITE_API_PREFIX: API_PREFIX } = env;

interface SearchData {
	current: number;
	size: number;
	name: string;
	beginTime: string;
	endTime: string;
}
// 图谱列表
export function getMyAltasList(data: SearchData) {
	return get(
		appendQueryParams(
			API_PREFIX + '/blade-tool/graphAnalysis/getMyGraphs',
			data
		)
	);
}

//删除
interface DeleteData {
	graphId: string;
}
export function deleteGraph(data: DeleteData) {
	return get(
		appendQueryParams(
			API_PREFIX + '/blade-tool/graphAnalysis/deleteGraph',
			data
		)
	);
}

//查看图谱
interface DetailData {
	graphId: string;
}
export function getDeatil(data: DetailData) {
	return get(
		appendQueryParams(API_PREFIX + '/blade-tool/graphAnalysis/getMyGraph', data)
	);
}
