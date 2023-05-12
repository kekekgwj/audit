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
export interface IFilterNode {
	type: string;
	value: string;
}
interface IPath {
	name: string;
	nextPaths: IPath[];
	// todo: properties
	properties: object[];
}
interface IFilters {
	algorithmName: string;
	depth: number;
	nodeFilter: string[];
	nodes: IFilterNode[];
	paths: IPath;
}
interface IGraphData {
	edges: IResEdge[];
	nodes: IResNode[];
}

interface IResNode {
	attrs: {
		key: string;
		label: string;
		value: string | null;
	};
	communityId: string | null;
	id: string;
	label: string;
	score: number | null;
	type: string;
}

interface IResEdge {
	attrs: {
		key: string;
		label: string;
		value: string | null;
	};
	id: string;
	similarity: null;
	source: string;
	target: string;
	type: string;
}

export const getGraph = (filters: IFilters) => {
	return post<IGraphData>(
		API_PREFIX + '/blade-tool/graphAnalysis/getGraph',
		filters
	);
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
