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
import { IGraphData, IResNode } from '@/api/knowLedgeGraph/graphin';
import Legend from './legend';
import LeftEvent from './LeftEvent';
import RightMenu from './RightMenu';

import styles from './index.module.less';
import formatCustomEdges from './customEdge';
import formatCustomNodes from './customNode';
import FocusCenter from './FocusCenter';
import { onSetCenterID, useFocuseState } from '@/redux/store';
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

const formatCombo = (nodes: IResNode[]) => {
	const comboID = new Set<string>();
	nodes.forEach((node) => {
		const { communityId } = node;
		communityId && comboID.add(communityId);
	});
	return [...comboID].map((id) => {
		return {
			id,
			label: 'communityID: ' + id
		};
	});
};
const formatGraphData = (data: IGraphData): GraphinData => {
	const { edges, nodes } = Object.assign({}, data);

	const customEdges = formatCustomEdges({ edges });
	const customNodes = formatCustomNodes({ nodes });
	const combos = formatCombo(nodes);

	return {
		edges: customEdges,
		nodes: customNodes,
		combos: combos
	};
};
interface IGraphContext {
	searchNewGraph: (nextGraphParam: INextGraphParam) => void;
	updateData: ((data: GraphinData) => void) | null;
	curData: Record<string, any> | null;
	setNextGraphInfo: ISetNextGraphInfo;
	getNextGraphInfo: IGetNextGraphInfo;
	resetAllNextGraph: () => void;
}
const GraphContext = createContext<IGraphContext>({
	updateData: null,
	curData: null,
	setNextGraphInfo: function ({
		nodeID,
		relations
	}: {
		nodeID: number;
		relations: string[];
	}): void {
		throw new Error('Function not implemented.');
	},
	getNextGraphInfo: function (nodeID: number): string[] {
		throw new Error('Function not implemented.');
	},
	searchNewGraph: function (nextGraphParam: INextGraphParam): void {
		throw new Error('Function not implemented.');
	},
	resetAllNextGraph: function (): void {
		throw new Error('Function not implemented.');
	}
});
export const useGraphContext = () => {
	return useContext(GraphContext);
};
type ISetNextGraphInfo = ({
	nodeID,
	relations
}: {
	nodeID: number;

	relations: string[];
}) => void;
type IGetNextGraphInfo = (nodeID: number) => string[];
interface INextGraphRef {
	[nodeId: string]: string[];
}
// 用于记录穿透下一层节点的勾选 id - path - nodes/edges
const useNextGraphRef = () => {
	const ref = useRef<INextGraphRef>({});
	const setNextGraphInfo: ISetNextGraphInfo = ({ nodeID, relations }) => {
		ref.current[nodeID] = relations;
	};
	const resetAllNextGraph = () => {
		ref.current = {};
	};
	const getNextGraphInfo = (nodeID: number): string[] => {
		return ref.current[nodeID] || [];
	};

	return { setNextGraphInfo, getNextGraphInfo, resetAllNextGraph };
};
const GraphinCom = React.memo((props: Props) => {
	const { data, updateData, refersh, searchNewGraph } = props;
	const formatData = formatGraphData(data);
	// 中心节点居中
	const centerNode = getCenterNode({ nodes: data.nodes });
	onSetCenterID({ centerID: centerNode });
	const [key, setKey] = useState('');

	const curData = { ...data };
	const [width, setWidth] = useState(600);
	const graphinContainerRef = useRef<HTMLDivElement>();
	// 调整尺寸
	useEffect(() => {
		const rect = graphinContainerRef?.current?.getBoundingClientRect();
		setWidth(rect?.width as number);
	}, []);

	useEffect(() => {
		const rect = graphinContainerRef?.current?.getBoundingClientRect();
		setKey(`${rect?.width}`);
		setWidth(rect?.width as number);
	}, [refersh]);
	const { setNextGraphInfo, getNextGraphInfo, resetAllNextGraph } =
		useNextGraphRef();
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
								onChange={(checkedValue, result) => {}}
							/>
						);
					}}
				</Legend>
				<LeftEvent />
				<GraphContext.Provider
					value={{
						updateData,
						curData,
						setNextGraphInfo,
						getNextGraphInfo,
						resetAllNextGraph,
						searchNewGraph
					}}
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
