import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react';
import Graphin, {
	Behaviors,
	type GraphinData,
	type LegendChildrenProps
} from '@antv/graphin';
const { DragCanvas, ZoomCanvas, DragNode, ActivateRelations } = Behaviors;
import { IGraphData } from '@/api/knowLedgeGraph/graphin';
import Legend from './legend';
import LeftEvent from './LeftEvent';
import RightMenu from './RightMenu';

import styles from './index.module.less';
import formatCustomEdges from './customEdge';
import formatCustomNodes from './customNode';
import FocusCenter from './FocusCenter';
import { onSetCenterID, useFocuseState } from '@/redux/store';
import { getNextGraph } from '../../../api/knowledgeGraph/graphin';
const { Hoverable } = Behaviors;
interface Props {
	data: IGraphData;
	refersh: boolean;
	updateData: (data: GraphinData) => void;
	onClose: () => void;
	id?: string;
}

const getCenterNode = ({ nodes }: Pick<IGraphData, 'nodes'>): string | null => {
	let centerNode = null;
	for (const node of nodes) {
		const { isCenter, id } = node;
		if (isCenter) {
			centerNode = id + '-node';
			break;
		}
	}
	return centerNode;
};

const formatGraphData = (data: IGraphData): GraphinData => {
	const { edges, nodes } = Object.assign({}, data);

	const customEdges = formatCustomEdges({ edges });
	const customNodes = formatCustomNodes({ nodes });

	return {
		edges: customEdges,
		nodes: customNodes
	};
};
interface IGraphContext {
	updateData: ((data: GraphinData) => void) | null;
	curData: Record<string, any> | null;
	setNextGraphInfo: ISetNextGraphInfo;
	getNextGraphInfo: IGetNextGraphInfo;
}
const GraphContext = createContext<IGraphContext>({
	updateData: null,
	curData: null,
	setNextGraphInfo: function ({
		nodeID,
		nodes,
		edges,
		path
	}: {
		nodeID: string;
		nodes: string[];
		edges: string[];
		path: string;
	}): void {
		throw new Error('Function not implemented.');
	},
	getNextGraphInfo: function (
		nodeID: string,
		path: string
	): INextGraphNode | null {
		throw new Error('Function not implemented.');
	}
});
export const useGraphContext = () => {
	return useContext(GraphContext);
};
interface INextGraphNode {
	nodes: Set<string>;
	edges: Set<string>;
}
type ISetNextGraphInfo = ({
	nodeID,
	// nodes,
	// edges,
	relations
}: {
	nodeID: string;
	// nodes: string[];
	// edges: string[];
	relations: string[];
}) => void;
type IGetNextGraphInfo = (
	nodeID: string,
	path: string
) => INextGraphNode | null;
// 用于记录穿透下一层节点的勾选 id - path - nodes/edges
const useNextGraphRef = () => {
	// const ref = useRef<Record<string, Record<string, INextGraphNode>>>({});
	const ref = useRef<Record<string, string[]>>({});
	const setNextGraphInfo: ISetNextGraphInfo = ({
		nodeID,
		// nodes,
		// edges,
		relations
	}) => {
		// if (!ref.current[nodeID]) {
		// 	ref.current[nodeID] = [];
		// }
		// ref.current[nodeID][path] = {
		// 	nodes: new Set(nodes),
		// 	edges: new Set(edges)
		// };
		// ref.current[nodeID][path] = {
		// 	nodes: new Set(nodes),
		// 	edges: new Set(edges)
		// };
	};
	const getNextGraphInfo = (
		nodeID: string,
		path: string
	): INextGraphNode | null => {
		const nodeInfo = ref.current[nodeID];

		return nodeInfo ? nodeInfo[path] || null : null;
	};
	return { setNextGraphInfo, getNextGraphInfo };
};
const GraphinCom = React.memo((props: Props) => {
	const { data, updateData, refersh } = props;
	const formatData = formatGraphData(data);
	const centerNode = getCenterNode({ nodes: data.nodes });
	onSetCenterID({ centerID: centerNode });
	const [key, setKey] = useState('');

	const curData = { ...data }; //当前图谱数据  穿透下一层时需要拼接数据
	const [width, setWidth] = useState(600);
	const graphinContainerRef = useRef<HTMLDivElement>();

	useEffect(() => {
		const rect = graphinContainerRef?.current?.getBoundingClientRect();
		setWidth(rect?.width as number);
	}, []);

	useEffect(() => {
		const rect = graphinContainerRef?.current?.getBoundingClientRect();
		setKey(`${rect?.width}`);
		setWidth(rect?.width as number);
	}, [refersh]);
	const { setNextGraphInfo, getNextGraphInfo } = useNextGraphRef();
	return (
		<div ref={graphinContainerRef} className={styles['graphin-box']}>
			<Graphin
				key={key}
				data={formatData}
				width={width}
				animate={false}
				layout={{
					type: 'force',
					preventOverlap: true,
					nodeSize: 200,
					nodeSpacing: 50
				}}
			>
				<Legend bindType="node" sortKey="config.type">
					{(renderProps: LegendChildrenProps) => {
						return (
							<Legend.Node
								{...renderProps}
								onChange={(checkedValue, result) => {
									console.log(
										'click legend',
										checkedValue,
										result,
										renderProps
									);
								}}
							/>
						);
					}}
				</Legend>
				<LeftEvent />
				<GraphContext.Provider
					value={{ updateData, curData, setNextGraphInfo, getNextGraphInfo }}
				>
					<RightMenu />
				</GraphContext.Provider>
				<FocusCenter />
				{/* <Hoverable bindType="node" /> */}
				<ZoomCanvas enableOptimize />
				<DragNode />
				<DragCanvas />
				<ActivateRelations />
			</Graphin>
		</div>
	);
});

export default GraphinCom;
