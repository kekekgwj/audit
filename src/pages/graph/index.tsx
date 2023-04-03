import React from 'react';
import classes from './index.module.less';
import Graphin, { Behaviors } from '@antv/graphin';
import type { GraphinData, EdgeStyle, NodeStyle } from '@antv/graphin';
const { DragCanvas, ZoomCanvas, DragNode, ActivateRelations } = Behaviors;
const mockData: GraphinData = {
	nodes: [
		{
			id: 'node-0',
			x: 100,
			y: 100
		},
		{
			id: 'node-1',
			x: 200,
			y: 200
		},
		{
			id: 'node-2',
			x: 100,
			y: 300
		}
	],
	edges: [
		{
			source: 'node-0',
			target: 'node-1'
		}
	]
};
const Graph = () => {
	return (
		<div className={classes.container}>
			<Graphin data={mockData}>
				<ZoomCanvas disabled />
			</Graphin>
		</div>
	);
};

export default Graph;
