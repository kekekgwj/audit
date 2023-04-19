import React, { useContext, useEffect } from 'react';
import '../relationship.less';
import Graphin, {
	Behaviors,
	GraphinContext,
	IG6GraphEvent,
	Components,
	ContextMenuValue,
	type GraphinData
} from '@antv/graphin';
import { Menu, message, Checkbox, Col, Row } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

// 原始数据
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
		},
		{
			id: 'node-3',

			style: {
				label: {
					value: '我是node3',
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
		},
		{
			id: 'node-4',
			style: {
				label: {
					value: '我是node4',
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
			id: 'edge-0-3',
			source: 'node-0',
			target: 'node-3',
			style: {
				label: {
					value: '我是边4'
				}
			}
		},
		{
			id: 'edge-3-4',
			source: 'node-3',
			target: 'node-4',
			style: {
				label: {
					value: '我是边5'
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
			id: 'edge-0-2',
			source: 'node-0',
			target: 'node-2',
			style: {
				label: {
					value: '我是边3'
				}
			}
		}
	]
};

const { Tooltip, ContextMenu } = Components;
interface Props {
	data: Object;
	updateData: (layout: any) => void;
	onClose: () => void;
	id?: string;
}

const MyMenu = React.memo((props: Props) => {
	const { data, id, onClose, updateData } = props;
	const [showRel, setshowRel] = React.useState(false);
	const [relArr, setRelArr] = React.useState([]);
	const [checkedRel, setCheckedRel] = React.useState([]);

	// 关系筛选
	const showRelationShip = (e) => {
		console.log(e, 173333);
		// 获取节点对应关系
		const edges = data.edges.filter((item) => {
			return item.source == id;
		});
		const arr = [];
		edges.forEach((el) => {
			arr.push(el.style.label.value);
		});
		// console.log(relArr, 184444);
		setRelArr(arr);
		console.log(relArr, 18444444);
		setshowRel(true);
	};
	const hideNode = () => {
		console.log(data, updateData, 222222);
		const nodes = data.nodes.filter((item) => {
			return item.id != id;
		});
		const edges = data.edges.filter((item) => {
			return item.source != id && item.target != id;
		});
		const newData = {
			edges,
			nodes
		};
		console.log(newData, 3222222222);
		updateData(newData);
		onClose();
	};

	const showChildNode = () => {
		//对象数组去重
		const removeDuplicateObj = (arr) => {
			const newArr = [];
			const obj = {};
			for (let i = 0; i < arr.length; i++) {
				if (!obj[arr[i].id]) {
					newArr.push(arr[i]);
					obj[arr[i].id] = true;
				}
			}
			return newArr;
		};

		// 获取原始数据？要这么麻烦吗......
		console.log(data, 13888888);
		// 需要添加的边
		const tedges = mockData.edges.filter((item) => {
			return item.source == id;
		});
		const nodesArr = []; //需要添加的节点
		if (tedges && tedges.length > 0) {
			tedges.forEach((el) => {
				nodesArr.push(el.target);
			});
		}
		const edges = removeDuplicateObj([...data.edges, ...tedges]);
		const tnodes = [];
		nodesArr.forEach((el) => {
			mockData.nodes.find((item) => {
				if (item.id == el) {
					tnodes.push(item);
				}
			});
		});

		const nodes = removeDuplicateObj([...data.nodes, ...tnodes]);
		const newData = {
			nodes,
			edges
		};
		updateData(newData);
		onClose();
	};

	const onChange = (checkedValues: CheckboxValueType[]) => {
		console.log('checked = ', checkedValues);
		setCheckedRel(checkedValues);
		const tedges = data.edges.filter((item) => {
			return item.source == id;
		});

		const otherEdges = data.edges.filter((item) => {
			return item.source != id;
		});

		const filterEdges = [];
		checkedValues.forEach((el) => {
			tedges.find((item) => {
				if (item.style.label.value == el) {
					filterEdges.push(item);
				}
			});
		});

		const edges = [...otherEdges, ...filterEdges];
		const nodes = [...data.nodes];
		const newData = {
			edges,
			nodes
		};
		console.log(data, 2766666);
		updateData(newData);
	};

	return (
		<div style={{ position: 'relative' }}>
			<Menu>
				<Menu.Item
					style={{ position: 'relative' }}
					onClick={(e) => {
						showRelationShip(e);
					}}
				>
					关系筛选
				</Menu.Item>
				<Menu.Item>穿透下一层</Menu.Item>
				<Menu.Item
					onClick={() => {
						showChildNode();
					}}
				>
					显示子节点
				</Menu.Item>
				<Menu.Item
					onClick={() => {
						hideNode();
					}}
				>
					隐藏该节点
				</Menu.Item>
			</Menu>
			{showRel ? (
				<div className="relationShipTip">
					<Checkbox.Group
						style={{ width: '100%' }}
						onChange={onChange}
						className="relationGroup"
					>
						<Row>
							{relArr.map((item, index) => (
								<Col span={24} key={index} className="relationItem">
									<Checkbox value={item}>{item}</Checkbox>
								</Col>
							))}
						</Row>
					</Checkbox.Group>
				</div>
			) : null}
		</div>
	);
});

const GraphinCom = React.memo((props: Props) => {
	const { data, updateData } = props;
	console.log(data, updateData, 544444);
	return (
		<Graphin data={data}>
			<Tooltip bindType="node" placement={'top'}>
				{(value: TooltipValue) => {
					if (value.model) {
						const { model } = value;
						console.log(model.id, 421111111);
						return (
							<div>
								<li> {model.id}</li>
							</div>
						);
					}
					return null;
				}}
			</Tooltip>
			<Tooltip bindType="edge" placement={'top'}>
				{(value: TooltipValue) => {
					if (value.model) {
						const { model } = value;
						console.log(model, 42222222222);
						return (
							<div>
								<li> {model.id}</li>
							</div>
						);
					}
					return null;
				}}
			</Tooltip>
			<ContextMenu style={{ background: '#fff' }} bindType="node">
				{(value) => {
					console.log(value, 101);
					const { onClose, id } = value;
					return (
						<MyMenu
							onClose={onClose}
							id={id}
							data={data}
							updateData={updateData}
						/>
					);
				}}
			</ContextMenu>
		</Graphin>
	);
});

export default GraphinCom;
