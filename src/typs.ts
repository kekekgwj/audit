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
}

interface INode {}
interface IEdge {}
