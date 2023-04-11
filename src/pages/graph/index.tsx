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
				},
				keyshape: {
					size: 80,
					stroke: '#ff9f0f',
					fill: '#ff9f0ea6'
				}
			}
		},
		{
			id: 'node-1',
			x: 200,
			y: 200,
			style: {
				label: {
					value: '我是node1',
					position: 'center',
					offset: [20, 5],
					fill: 'green'
				},
				keyshape: {
					size: 60,
					stroke: '#ff9f0f',
					fill: '#ff9f0ea6'
				}
			}
		},
		{
			id: 'node-2',
			x: 100,
			y: 300,
			style: {
				label: {
					value: '我是node2',
					position: 'center',
					offset: [20, 5],
					fill: 'green'
				},
				keyshape: {
					size: 40,
					stroke: '#ff9f0f',
					fill: '#ff9f0ea6'
				}
			}
		}
	],
	edges: [
		{
			id: 'edge-0-1',
			source: 'node-0',
			target: 'node-1',
			style: {
				label: {
					value: '我是边1'
				}
			}
		},
		{
			id: 'edge-1-2',
			source: 'node-1',
			target: 'node-2',
			style: {
				label: {
					value: '我是边2'
				},
				keyshape: {
					lineWidth: 5,
					stroke: '#00f'
				}
			}
		},
		{
			id: 'edge-2-0',
			source: 'node-2',
			target: 'node-0',
			style: {
				label: {
					value: '我是边3'
				}
			}
		}
	]
};

interface Props {
	type: string;
	changeLayout: (layout: any) => void;
	changeDefaultEdge: (layout: any) => void;
}

// 右边信息展示
const RightBarCom = React.memo((props: Props) => {
	// 改变布局及其配置的方法
	const { changeLayout, type, changeDefaultEdge } = props;
	const onChange = (key: string) => {
		console.log(key);
	};

	const defaultStyle: React.CSSProperties = {
		position: 'absolute',
		right: 0,
		top: 0,
		width: '500px',
		height: '600px'
	};

	const items: TabsProps['items'] = [
		{
			key: '1',
			label: `布局样式`,
			children: (
				<LayoutStyle
					type={type}
					changeLayout={changeLayout}
					changeDefaultEdge={changeDefaultEdge}
				></LayoutStyle>
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
			const el = graph.findById(model.id);
			console.log(el, node, model, 130000000000);
			dispatch(
				toClickNode({ id: model.id, x: model.x, y: model.y, type: 'node' })
			);
		};

		const handleEdegClick = (evt: IG6GraphEvent) => {
			const edge = evt.item;
			const model = edge.getModel();
			const el = graph.findById(model.id);
			console.log(el, model, 10999999);
			dispatch(
				toClickEdge({
					id: model.id,
					// source: model.source,
					// target: model.target,
					type: 'edge'
				})
			);
		};
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
	const [data, setData] = React.useState({
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
					},
					keyshape: {
						size: 80,
						stroke: '#ff9f0f',
						fill: '#ff9f0ea6'
					}
				}
			},
			{
				id: 'node-1',
				x: 200,
				y: 200,
				style: {
					label: {
						value: '我是node1',
						position: 'center',
						offset: [20, 5],
						fill: 'green'
					},
					keyshape: {
						size: 60,
						stroke: '#ff9f0f',
						fill: '#ff9f0ea6'
					}
				}
			},
			{
				id: 'node-2',
				x: 100,
				y: 300,
				style: {
					label: {
						value: '我是node2',
						position: 'center',
						offset: [20, 5],
						fill: 'green'
					},
					keyshape: {
						size: 40,
						stroke: '#ff9f0f',
						fill: '#ff9f0ea6'
					}
				}
			}
		],
		edges: [
			{
				id: 'edge-0-1',
				source: 'node-0',
				target: 'node-1',
				style: {
					label: {
						value: '我是边1'
					}
				}
			},
			{
				id: 'edge-1-2',
				source: 'node-1',
				target: 'node-2',
				style: {
					label: {
						value: '我是边2'
					},
					keyshape: {
						lineWidth: 5,
						stroke: '#00f'
					}
				}
			},
			{
				id: 'edge-2-0',
				source: 'node-2',
				target: 'node-0',
				style: {
					label: {
						value: '我是边3'
					}
				}
			}
		]
	});
	const [state, setState] = React.useState({
		type: 'dagre',
		options: {}
	});

	// 默认节点样式配置
	// const [defaultNode, setdefaultNode] = React.useState({
	// 	nodeStyle: {}
	// });

	// 修改布局
	const changeLayout = (value) => {
		setState(value);
	};

	// 修改默认边配置
	const changeDefaultEdge = async (value) => {
		console.log(value, 2511111);
		mockData.edges.forEach((edge) => {
			edge.style.label = Object.assign({}, value.style.label, edge.style.label);
			edge.style.keyshape = Object.assign(
				{},
				value.style.keyshape,
				edge.style.keyshape
			);
		});
		console.log(mockData, 2655555);
		setData(mockData);
		console.log(data, 26333333);
	};

	const { type, options } = state;
	useEffect(() => {
		console.log(mockData, data, 270000);
	}, [mockData]);

	return (
		<div className="main-content">
			<Graphin data={data} layout={{ type, ...options }}>
				<ZoomCanvas disabled />
				<SampleBehavior></SampleBehavior>
				<RightBarCom
					type={type}
					changeLayout={changeLayout}
					className="right-bar"
					changeDefaultEdge={changeDefaultEdge}
				></RightBarCom>
			</Graphin>
		</div>
	);
};

export default Graph;
