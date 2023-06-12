import React, { useEffect } from 'react';
import { useGraphContext, useGraphID, useGraphInstance } from './lib/Graph';
import { onClickGraphNode } from '@/redux/store';
import { debounce } from 'debounce';
import { syncData } from './lib/utils';

const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
	for (let i = 0, len = ports.length; i < len; i += 1) {
		ports[i].style.visibility = show ? 'visible' : 'hidden';
	}
};
const GraphWatchEvents = () => {
	const graphContext = useGraphInstance();
	const graph = graphContext?.graph;
	const container = document.getElementById('x6-graph')!;
	const projectID = useGraphID();
	const {
		getConfigValue,
		saveConfigValue,
		resetConfigValue,
		getAllConfigs,
		syncGraph
	} = useGraphContext();
	useEffect(() => {
		if (!graph) {
			return;
		}
		graph.on('node:mouseenter', () => {
			const ports = container.querySelectorAll(
				'.x6-port-body'
			) as NodeListOf<SVGElement>;
			showPorts(ports, true);
		});
		graph.on('node:mouseleave', () => {
			const ports = container.querySelectorAll(
				'.x6-port-body'
			) as NodeListOf<SVGElement>;
			showPorts(ports, false);
		});
		graph.on('node:dblclick', ({ node }) => {
			const { id } = node;
			onClickGraphNode(id);
			// const cell = graph.getCellById(id);
			// const clickNodeType = getNodeTypeById(graph, id)[0] as IImageTypes;

			// const edges = graph.getEdges();
			// const sourceNodes: string[] = [];
			// // 找到节点的所有连接节点
			// edges.forEach((e) => {
			// 	const sourceID = e.getSourceCellId();
			// 	const targetID = e.getTargetCellId();
			// 	if (targetID === id) {
			// 		sourceNodes.push(sourceID);
			// 	}
			// });
			// // 获取到所有连接节点的type
			// const types = getNodeTypeById(graph, sourceNodes);
		});
		graph.bindKey(['meta+a', 'ctrl+a'], () => {
			const nodes = graph.getNodes();
			if (nodes) {
				graph.select(nodes);
			}
		});

		// delete
		graph.bindKey('backspace', () => {
			const cells = graph.getSelectedCells();
			if (cells.length) {
				graph.removeCells(cells);
			}
		});

		graph.on(
			'cell:changed',
			debounce(() => {
				syncGraph();
			}, 200)
		);
		graph.on('cell:added', () => syncGraph());
		graph.on('cell:removed', () => syncGraph());

		return () => {
			graph.off('node:mouseenter');
			graph.off('node:mouseleave');
			graph.off('cell:changed');
			graph.off('cell:added');
			graph.off('cell:removed');
			graph.unbindKey('backspace');
			graph.unbindKey(['meta+a', 'ctrl+a']);
		};
	}, [graph]);

	return null;
};

export default GraphWatchEvents;
