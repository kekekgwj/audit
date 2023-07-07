import React, { useEffect, useRef, useState } from 'react';
import Graphin, {
	Behaviors,
	G6,
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
import { onSetCenterID } from '@/redux/store';
import { useGraphContext } from '../hooks';
interface IProps {
	isClusterLayout: boolean;
}
const getCenterNode = ({ nodes }: Pick<IGraphData, 'nodes'>): string | null => {
	let centerNode = null;
	for (const node of nodes) {
		const { center, id } = node;
		if (center) {
			centerNode = id + '-node';
			break;
		}
	}
	return centerNode;
};

const formatCombo = (nodes: IResNode[]) => {
	const comboID = new Set<string>([]);
	// const comboID = new Set<string>([2001, 2002]);
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
const defaultLayout = {
	type: 'force',
	preventOverlap: true,
	nodeSize: 200,
	nodeSpacing: 50
};
const clusterLayout = {
	type: 'force',
	clustering: true,
	clusterNodeStrength: -5,
	clusterEdgeDistance: 200,
	clusterNodeSize: 20,
	clusterFociStrength: 1.2,
	nodeSpacing: 5,
	preventOverlap: true
};
const layout = {
	type: 'comboCombined',
	animation: 'false',
	comboPadding: 120,
	preventOverlap: true,
	outerLayout: new G6.Layout['gForce']({
		// gForce forceAtlas2 graphin-force
		preventOverlap: true,
		animation: false, // for graphin-force
		animate: false, // for gForce and fruchterman
		gravity: 1,
		factor: 100,
		linkDistance: (edge, source, target) => {
			const nodeSize =
				((source.size?.[0] || 40) + (target.size?.[0] || 40)) / 2;
			return Math.min(nodeSize * 1.5, 1000);
		}
	})
};
const GraphinCom = ({ isClusterLayout = false }: IProps) => {
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
				layout={isClusterLayout ? layout : defaultLayout}
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
				<DragNode onlyChangeComboSize={true} />
				{/* <DragNode /> */}
				<DragCanvas />
				<ActivateRelations />
			</Graphin>
		</div>
	);
};

export default GraphinCom;
