import type { GraphData, NodeConfig, EdgeConfig } from '@antv/graphin';
/**
 * 属性面板
 */
interface IPropertiesProps {
	title: string;
	data: IPropertiesData[];
	children?: React.ReactElement;
}

interface IPropertiesData {
	[key: string]: string;
}

/**
 * 响应
 */

interface IResponse {
	data: IDTO;
}
interface IDTO {
	nodes: INode[];
	edges: IEdge[];
	styles: any;
}
interface INodeProps {
	[key: string]: any;
}
interface INode {
	id: string;
	props: INodeProps;
	groupId: string;
}
interface IEdge {
	id: string;
	source: string;
	target: string;
}
