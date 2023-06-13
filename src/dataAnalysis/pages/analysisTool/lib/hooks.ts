import { Graph, Node, Edge } from '@antv/x6';
import {
	useRef,
	useEffect,
	useState,
	useCallback,
	useMemo,
	useContext,
	createContext
} from 'react';
import { diffCells, patch, checkId } from './utils';
import { useLocation, useNavigate } from 'react-router';
import * as X6 from '@antv/x6';
type GraphState = {
	nodes?: Node.Metadata[];
	edges?: Edge.Metadata[];
	graph?: Graph;
};
interface IGraphInfo {
	goBack: () => void;
	pathName: string; //上一级菜单名称
	templateName: string; //模板名称
	projectId: number; //模板id
}
export const useGraphPageInfo = (): IGraphInfo => {
	const location = useLocation();
	const pathName = location.state.path; //上一级界面名称
	const templateName = location.state.name; //模板名称
	const projectId = location.state.id;
	const navigate = useNavigate();
	const goBack = () => {
		navigate(-1);
	};
	return {
		pathName,
		templateName,
		projectId,
		goBack
	};
};

export const useGraphState = (initState: GraphState = {}) => {
	const { nodes: n = [], edges: e = [], graph: g = null } = initState;
	const [nodes, _setNodes] = useState<Node.Metadata[]>(n);
	const [edges, _setEdges] = useState<Edge.Metadata[]>(e);
	const graph = useRef<Graph | null>(g);

	const diffNodes = useMemo(
		() => diffCells(graph.current, nodes, 'node'),
		[nodes]
	);
	// 节点变化可能引起边的变化
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const diffEdges = useMemo(
		() => diffCells(graph.current, edges, 'edge'),
		[nodes, edges]
	);

	const setGraph = useCallback((_g: Graph) => {
		if (_g) {
			graph.current = _g;
		}
	}, []);

	const eventName = 'update:state';
	// 注册一个自定义事件，patch完成后触发
	const returnPromise = (execute: () => void) => {
		return new Promise((resolve) => {
			if (graph.current) {
				graph.current.once(eventName, resolve);
			}
			execute();
		});
	};
	// 更新state数据之前先检查id是否存在，自动创建id，确保diffCells的时候能使用id进行判断
	const setNodes = (_nodes: Node.Metadata[]) =>
		returnPromise(() => _setNodes(_nodes.map(checkId)));
	const setEdges = (_edges: Edge.Metadata[]) =>
		returnPromise(() => _setEdges(_edges.map(checkId)));

	const triggerEvent = () => graph.current && graph.current.trigger(eventName);
	// 使用patch函数更新数据到x6画布
	useEffect(() => {
		patch(graph.current, diffNodes);
		triggerEvent();
	}, [diffNodes]);
	useEffect(() => {
		patch(graph.current, diffEdges);
		triggerEvent();
	}, [diffEdges]);

	return {
		nodes,
		edges,
		graph,
		setNodes,
		setEdges,
		setGraph
	};
};

interface IGraphContext extends IGraphConfig {
	graph: X6.Graph | null;
	startDrag: (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		{ label, image, type }: IImageShapes
	) => void;
	projectID: number | null;
}
interface IGraphConfig {
	getConfigValue: (id: string) => any;
	saveConfigValue: (id: string, value: any) => void;
	resetConfigValue: (id: string) => void;
	getAllConfigs: () => void;
	setAllConfigs: (value: any) => void;
	syncGraph: () => void;
}
export const useGraph = () => {
	const { graph } = useContext(GraphContext) || {};
	return graph;
};
export const useGraphID = () => {
	const { projectID } = useContext(GraphContext) || {};
	return projectID;
};

export const useGraphContext = () => {
	return useContext(GraphContext);
};

export const useNodeConfigValue: () => IGraphConfig = () => {
	const ref = useRef<Record<string, object>>({});

	const getConfigValue = useCallback((id: string) => {
		if (ref.current) {
			return ref.current[id];
		} else {
			null;
		}
	}, []);
	const saveConfigValue = useCallback((id: string, value: any) => {
		ref.current[id] = value;
	}, []);
	const resetConfigValue = useCallback((id: string) => {
		saveConfigValue(id, null);
	}, []);
	const getAllConfigs = () => {
		return ref.current;
	};
	const setAllConfigs = (value: any) => {
		ref.current = value;
	};
	return {
		getConfigValue,
		saveConfigValue,
		resetConfigValue,
		getAllConfigs,
		setAllConfigs
	};
};
export const GraphContext = createContext<IGraphContext>({
	graph: null,
	startDrag: function (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		{ label, image, type, labelCn }: IImageShapes
	): void {
		throw new Error('Function not implemented.');
	},
	projectID: null,
	getConfigValue: function (id: string) {
		throw new Error('Function not implemented.');
	},
	saveConfigValue: function (id: string, value: any): void {
		throw new Error('Function not implemented.');
	},
	resetConfigValue: function (id: string): void {
		throw new Error('Function not implemented.');
	},
	getAllConfigs: function (): void {
		throw new Error('Function not implemented.');
	},
	setAllConfigs: function (value: any): void {
		throw new Error('Function not implemented.');
	},
	syncGraph: function (): void {
		throw new Error('Function not implemented.');
	}
});
