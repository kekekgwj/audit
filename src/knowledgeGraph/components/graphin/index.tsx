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
import { useGraphContext } from '../hooks';
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
const formatGraphData = (data: IGraphData | null): GraphinData => {
	if (!data) {
		return { nodes: [], edges: [] };
	}
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

const GraphinCom = () => {
	const { data, refresh } = useGraphContext();
	const formatData = formatGraphData(data);
	// 中心节点居中
	const centerNode = getCenterNode({ nodes: data?.nodes });
	onSetCenterID({ centerID: centerNode });
	const [key, setKey] = useState('');
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
	}, [refresh]);

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

				<RightMenu />

				<FocusCenter />
				{/* <Hoverable bindType="node" /> */}
				<ZoomCanvas enableOptimize />
				<DragNode />
				<DragCanvas />
				<ActivateRelations />
			</Graphin>
		</div>
	);
};

export default GraphinCom;
