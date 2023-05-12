import { INextPathResponse } from '@/knowledgeGraph/components/sidebar/attr-filter';
import { appendQueryParams, get, post } from '@/utils/request';
const env = import.meta.env;
const { VITE_API_PREFIX: API_PREFIX } = env;
// interface IResponse<T> {
// 	code: string | number;
// 	data: T;
// 	success: string;
// 	msg: string;
// }

interface INodes {
	id: number;
	name: string;
	// "type": null,
	// "hasWhiteList": null,
	// "status": null
}
export const getMainNodes = () => {
	return get<INodes[]>(API_PREFIX + '/blade-tool/graphAnalysis/getNodes');
};
interface IFilterNode {
	type: string;
	value: string;
}
interface IFilters {
	algorithmName: string;
	depth: number;
	nodeFilter: string[];
	nodes: IFilterNode[];
	paths: any;
}
export const getGraph = (filters: IFilters) => {
	return post(API_PREFIX + '/blade-tool/graphAnalysis/getGraph', filters);
};

// 链路查询
export const getNextPaths = (data: any) => {
	return post<INextPathResponse[]>(
		API_PREFIX + '/blade-tool/graphAnalysis/getNextPaths',
		data
	);
};

// 获取下一层关系
interface Relationships {
	nodeId: string;
}
export const getNextRelationships = (data: Relationships) => {
	return get(
		appendQueryParams(
			API_PREFIX + '/blade-tool/graphAnalysis/getNextRelationships',
			data
		)
	);
};

// 穿透下一层
interface NextGraph {
	nodeId: string;
	relationships: string[];
}
export const getNextGraph = (data: any) => {
	return post(API_PREFIX + '/blade-tool/graphAnalysis/getNextGraph', data);
};
