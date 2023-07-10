import { INextPathResponse } from '@/knowledgeGraph/components/sidebar/attr-filter';
import { appendQueryParams, get, post, postFormData } from '@/utils/request';
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
	nextGraphs?: INextGraphParam[] | null;
}
export interface IGraphData {
	edges: IResEdge[];
	nodes: IResNode[];
	limited: boolean;
}

export interface IResNode {
	attrs: {
		key: string;
		label: string;
		value: string | null;
	};
	communityId: string | null;
	id: string;
	labels: string[];
	score: number | null;
	type: string;
	center?: boolean;
}

export interface IResEdge {
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
export interface INextGraphParam {
	nodeId: number;
	relationships: string[];
}
export const getGraph: (filters: IFilters) => Promise<IGraphData> = ({
	algorithmName = null,
	depth = 4,
	nodeFilter = [],
	nodes,
	paths = null,
	nextGraphs = null
}) => {
	return post<IGraphData>(API_PREFIX + '/blade-tool/graphAnalysis/getGraph', {
		algorithmName,
		depth,
		nodeFilter,
		nodes,
		paths,
		nextGraphs
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
export const getNextGraph = (data: NextGraph): Promise<IGraphData> => {
	return post(API_PREFIX + '/blade-tool/graphAnalysis/getNextGraph', data);
};

//上传图片
export function uploadGraphPic(formData: FormData) {
	return postFormData(
		API_PREFIX + '/blade-tool/graphAnalysis/uploadGraphPic',
		formData
	);
}

//保存图谱
interface ISaveGraph {
	name: string;
	picUrl: string;
	ruleId?: number | string;
	ruleName?: string;
	head?: [];
	data?: [];
}
export function saveGraph(data: ISaveGraph) {
	return post(API_PREFIX + '/blade-tool/graphAnalysis/saveGraph', data);
}

//获取所有算法
interface IAlgs {
	id: number;
	name: string;
	type: string;
}
export const getAlgs = () => {
	return post<IAlgs[]>(API_PREFIX + '/blade-tool/graphAnalysis/getAlgs');
};
