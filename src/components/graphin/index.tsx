import React from 'react';
import Graphin, {
	Components,
	type TooltipValue,
	type GraphinData,
	type LegendChildrenProps,
	IUserEdge,
	IUserNode
} from '@antv/graphin';
import { Menu, Checkbox, Col, Row } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import registerNodes from './custom-node';
import registerEdges from './custom-edge';
import styles from './index.module.less';
import { ModelConfig } from '@antv/g6';

// 注册自定义节点
registerNodes('all');
registerEdges('all');

// 图例
const { Legend } = Components;

// 原始数据
const mockData: GraphinData = {
	nodes: [
		{
			id: 'node-0',
			x: 100,
			y: 100,
			data: {
				type: 'centerPointer'
			},
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
			data: {
				type: 'project'
			},
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
			data: {
				type: 'project'
			},
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
			data: {
				type: 'person'
			},
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
			data: {
				type: 'person'
			},
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
	data: GraphinData;
	updateData: (layout: any) => void;
	onClose: () => void;
	id?: string;
}

interface NodeDetailProps {
	nodeModel: ModelConfig;
}

const NodeDetail = React.memo((props: NodeDetailProps) => {
	const { nodeModel } = props;
	return (
		<div>
			<div>节点详情</div>
			<div>节点id:{nodeModel.id as string}</div>
			<div>节点id:{nodeModel.id as string}</div>
		</div>
	);
});

const MyMenu = React.memo((props: Props) => {
	const { data, id, onClose, updateData } = props;
	const [showRel, setshowRel] = React.useState(false);
	const [relArr, setRelArr] = React.useState(
		Array<string | number | undefined>
	);
	const [checkedRel, setCheckedRel] = React.useState([]);

	// 关系筛选
	const showRelationShip = () => {
		// 获取节点对应关系
		const edges = data.edges.filter((item) => {
			return item.source == id;
		});
		const arr: Array<string | number | undefined> = [];
		edges.forEach((el) => {
			arr.push(el.style.label.value);
		});
		// console.log(relArr, 184444);
		setRelArr(arr);
		setshowRel(true);
	};

	//隐藏节点
	const hideNode = () => {
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
		updateData(newData);
		onClose();
	};

	//显示子节点
	const showChildNode = () => {
		//对象数组去重
		const removeDuplicateObj = (arr: IUserNode[]) => {
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
		const nodesArr: IUserNode[] = []; //需要添加的节点
		if (tedges && tedges.length > 0) {
			tedges.forEach((el) => {
				nodesArr.push(el.target);
			});
		}
		const edges = removeDuplicateObj([...data.edges, ...tedges]);
		const tnodes: IUserNode[] = [];
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

	//右键菜单触发筛选
	const onChange = (checkedValues: CheckboxValueType[]) => {
		console.log('checked = ', checkedValues);
		setCheckedRel(checkedValues);
		const tedges = data.edges.filter((item) => {
			return item.source == id;
		});

		const otherEdges = data.edges.filter((item) => {
			return item.source != id;
		});

		const filterEdges: IUserEdge[] = [];
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
				<Menu.Item style={{ position: 'relative' }} onClick={showRelationShip}>
					关系筛选
				</Menu.Item>
				<Menu.Item>穿透下一层</Menu.Item>
				<Menu.Item onClick={showChildNode}>显示子节点</Menu.Item>
				<Menu.Item
					onClick={() => {
						hideNode();
					}}
				>
					隐藏该节点
				</Menu.Item>
			</Menu>
			{showRel ? (
				<div className={styles['relationShipTip']}>
					<Checkbox.Group
						style={{ width: '100%' }}
						onChange={onChange}
						className={styles['relationGroup']}
					>
						<Row>
							{relArr.map((item, index) => (
								<Col span={24} key={index} className={styles['relationItem']}>
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

	return (
		<Graphin
			data={data}
			layout={{
				type: 'force',
				// linkDistance: 400,
				preventOverlap: true,
				nodeSize: 140,
				nodeSpacing: 50
			}}
		>
			<Tooltip bindType="node" placement={'top'}>
				{(value: TooltipValue) => {
					if (value.model) {
						const { model } = value;
						return <NodeDetail nodeModel={model} />;
					}
					return null;
				}}
			</Tooltip>
			<Tooltip bindType="edge" placement={'top'}>
				{(value: TooltipValue) => {
					if (value.model) {
						const { model } = value;
						return (
							<div>
								<li>{model.id}</li>
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
			<Legend bindType="node" sortKey="typeName">
				{(renderProps: LegendChildrenProps) => {
					console.log('renderProps', renderProps);
					return <Legend.Node {...renderProps} />;
				}}
			</Legend>
		</Graphin>
	);
});

export default GraphinCom;
