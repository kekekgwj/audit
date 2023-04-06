import React, { useContext, useEffect } from 'react';
// import classes from './index.module.less';
import './index.less';
import Graphin, {
	Behaviors,
	GraphinContext,
	IG6GraphEvent
} from '@antv/graphin';
import { INode, NodeConfig } from '@antv/g6';
import type { GraphinData, EdgeStyle, NodeStyle } from '@antv/graphin';
const { DragCanvas, ZoomCanvas, DragNode, ActivateRelations } = Behaviors;
// import { dispatch } from '../../redux/store';
import {
	toClickNode,
	toClickEdge,
	initialStateGraph
} from '../../redux/reducers';
import { useSelector, useDispatch } from 'react-redux';
import { store } from '../../redux/store';
import { render } from 'react-dom';
import LayoutStyle from '../layoutStyle';
import { Tabs } from 'antd';
const mockData: GraphinData = {
	nodes: [
		{
			id: 'node-0',
			x: 100,
			y: 100,
			style: {
				label: {
					value: '我是node0',
					position: 'center',
					offset: [20, 5],
					fill: 'green'
				}
			}
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
			id: 'edge-0-1',
			source: 'node-0',
			target: 'node-1'
		},
		{
			id: 'edge-1-2',
			source: 'node-1',
			target: 'node-2'
		},
		{
			id: 'edge-2-0',
			source: 'node-2',
			target: 'node-0'
		}
	]
};

interface Props {
	type: string;
	changeLayout: (layout: any) => void;
}

// 右边信息展示
const RightBarCom = React.memo((props: Props) => {
	// 改变布局及其配置的方法
	const { changeLayout, type } = props;
	const onChange = (key: string) => {
		console.log(key);
	};

	const defaultStyle: React.CSSProperties = {
		width: '500px',
		height: '600px'
	};

	const items: TabsProps['items'] = [
		{
			key: '1',
			label: `布局样式`,
			children: (
				<LayoutStyle type={type} changeLayout={changeLayout}></LayoutStyle>
			)
		},
		{
			key: '2',
			label: `数据过滤`,
			// children: <DataFilter></DataFilter>
			children: <span>222222222222</span>
		},
		{
			key: '3',
			label: `数据统计`,
			children: <span>333333333333</span>
		}
	];

	return (
		<Tabs
			style={{ ...defaultStyle }}
			tabBarGutter="50"
			defaultActiveKey="1"
			items={items}
			onChange={onChange}
		></Tabs>
	);
});
RightBarCom.displayName = 'RightBarCom';

// 自定义左键选中节点
const SampleBehavior = React.memo(() => {
	const dispatch = useDispatch();
	const { graph, apis } = useContext(GraphinContext);

	useEffect(() => {
		const handleClick = (evt: IG6GraphEvent) => {
			const node = evt.item as INode;
			const model = node.getModel() as NodeConfig;
			apis.focusNodeById(model.id);
			const el = graph.findById(model.id);
			console.log(el, model, 130000000000);
			dispatch(toClickNode({ id: model.id, x: model.x, y: model.y }));
		};

		const handleEdegClick = (evt: IG6GraphEvent) => {
			const edge = evt.item;
			const model = edge.getModel();
			console.log(evt, model, 10999999);
			dispatch(
				toClickEdge({
					id: model.id,
					source: model.source,
					target: model.target
				})
			);
		};
		// 每次点击聚焦到点击节点上
		graph.on('node:click', handleClick);
		graph.on('edge:click', handleEdegClick);
		return () => {
			graph.off('node:click', handleClick);
			graph.off('edge:click', handleEdegClick);
		};
	}, []);
	return null;
});
SampleBehavior.displayName = 'SampleBehavior';

// 画布主体
const Graph = () => {
	const [state, setState] = React.useState({
		type: 'dagre',
		options: {}
	});
	const changeLayout = (value) => {
		setState(value);
	};
	const { type, options } = state;
	return (
		<div className="main-content">
			<div className="graphin-content">
				<Graphin data={mockData} layout={{ type, ...options }}>
					<ZoomCanvas disabled />
					<SampleBehavior></SampleBehavior>
					{/* <NodeDetail></NodeDetail> */}
				</Graphin>
			</div>
			<RightBarCom
				type={type}
				changeLayout={changeLayout}
				className="right-bar"
			></RightBarCom>
		</div>
	);
};

export default Graph;
