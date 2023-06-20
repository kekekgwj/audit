import React, { useEffect, useState } from 'react';
import { useGraphContext } from './lib/hooks';
import { onClickGraphNode } from '@/redux/store';
import { debounce } from 'debounce';
import { onClickCloseConfigPanel } from '@/redux/store';
import { IImageTypes } from './lib/utils';

const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
	for (let i = 0, len = ports.length; i < len; i += 1) {
		ports[i].style.visibility = show ? 'visible' : 'hidden';
	}
};
const GraphWatchEvents = () => {
	const container = document.getElementById('x6-graph')!;
	const { syncGraph, graph } = useGraphContext();

	const resetGraph = () => {
		if (!graph) return;
		const nodes = graph.getNodes();

		nodes.forEach((node) => {
			const custom = node.store.data.attrs.custom;
			custom.isSelected = false;
			if (custom.type === IImageTypes.TABLE) {
				node.attr('body/stroke', '#ccc');
				node.attr('label/fill', '#767676');
			} else {
				const defaultImage = custom.defaultImage;
				node.attr('img/xlink:href', defaultImage);
			}
		});
	};

	useEffect(() => {
		if (!graph) {
			return;
		}

		graph.on('node:click', ({ node }) => {
			resetGraph();
			const custom = node.store.data.attrs.custom;
			custom.isSelected = true;
			if (custom.type === IImageTypes.TABLE) {
				node.attr('body/stroke', '#24a36f');
				node.attr('label/fill', '#24a36f');
			} else {
				const activeImage = custom.activeImage;
				node.attr('img/xlink:href', activeImage);
			}
		});

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
		});
		graph.bindKey(['meta+a', 'ctrl+a'], () => {
			const nodes = graph.getNodes();
			if (nodes) {
				graph.select(nodes);
			}
		});
		// 点击画布，关闭配置
		graph.on('blank:click', () => {
			resetGraph();
			onClickCloseConfigPanel();
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
		graph.on('cell:removed', ({ cell, index, options }) => {
			const custom = cell.store.data.attrs.custom;
			if (custom && custom.isSelected) {
				syncGraph();
			}
		});

		return () => {
			graph.off('node:click');
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
