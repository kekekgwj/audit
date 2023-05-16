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
export interface IPath {
	name: string;
	nextPaths: IPath[];
	properties: IProperty[];
}

interface IOperation {
	// 运算符 1-等于 2-大于 3-大于等于 4-小于 5-小于等于
	operatorType: number;
	value: string;
}

export type IProperty =
	| {
			key: string;
			operations: IOperation[];
			type: number;
			// 运算条件之间的连接符 1-且 2-或
			operationLinks: number[];
	  }
	| Record<string, never>;
interface IFilters {
	algorithmName?: string;
	depth?: number;
	nodeFilter?: string[];
	nodes: IFilterNode[];
	paths?: IPath | null;
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

export const getGraph: (filters: IFilters) => Promise<IGraphData> = ({
	algorithmName = null,
	depth = 4,
	nodeFilter = [],
	nodes,
	paths = null
}) => {
	return post<IGraphData>(API_PREFIX + '/blade-tool/graphAnalysis/getGraph', {
		algorithmName,
		depth,
		nodeFilter,
		nodes,
		paths
	});
};
interface IGetNextPaths {
	nodeFilter: string[];
	parentPaths: string[];
	type: string;
	value: string;
}
// 链路查询
export const getNextPaths = (data: IGetNextPaths) => {
	return post<INextPathResponse[]>(
		API_PREFIX + '/blade-tool/graphAnalysis/getNextPaths',
		data
	);
};

interface IGetNextPath {
	nodeId: number;
	relationships: string[];
}
// 穿透下一层
export const getNextGraph = (data: IGetNextPath) => {
	return post<IGraphData>(
		API_PREFIX + '/blade-tool/graphAnalysis/getNextGraph',
		data
	);
};
