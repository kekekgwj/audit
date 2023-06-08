import React, { useContext, useEffect, useRef, useState } from 'react';
import Graphin, {
	Components,
	IG6GraphEvent,
	GraphinContext,
	Utils,
	type TooltipValue,
	type GraphinData,
	type LegendChildrenProps
} from '@antv/graphin';
import registerNodes from './custom-node/index';
import registerEdges from './custom-edge/index';
import styles from './index.module.less';
import { INode, ModelConfig, NodeConfig } from '@antv/g6';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { Checkbox, Col, Row } from 'antd';
import {
	IGraphData,
	getNextGraph,
	getNextRelationships
} from '@/api/knowledgeGraph/graphin';
import Legend from './legend';
// import NormalDistribution from 'normal-distribution';
// 注册自定义节点
registerNodes('all');
registerEdges('all');

//功能组件
const { Tooltip, ContextMenu } = Components;

interface Props {
	data: IGraphData;
	refersh: boolean;
	updateData: (data: GraphinData) => void;
	onClose: () => void;
	id?: string;
}

interface MenuProps {
	onClose: () => void;
	updateData: (data: GraphinData) => void;
	id?: string;
	curData: any;
}

interface NodeDetailProps {
	nodeModel: ModelConfig;
}

const EdgeDetail = React.memo((props: NodeDetailProps) => {
	const { nodeModel } = props;
	const attrArr = nodeModel.attrs ? nodeModel.attrs : [];
	return (
		<div className={styles['node-detail-box']}>
			{attrArr.map((item) => {
				return (
					<div className={styles['node-detail-item']}>
						<span className={styles['detail-item-title']}>{item.label}:</span>
						{item.value}
					</div>
				);
			})}
		</div>
	);
});

interface DetailProps {
	detailData: ModelConfig;
}
const DetailInfo = React.memo((props: DetailProps) => {
	const { detailData } = props;
	return (
		<div className={styles['detail-info-box']}>
			<div className={styles['node-detail-box']}>
				{detailData.map((item) => {
					return (
						<div className={styles['node-detail-item']}>
							<span className={styles['detail-item-title']}>{item.label}:</span>
							{item.value}
						</div>
					);
				})}
			</div>
		</div>
	);
});

// 自定义左键点击事件
const LeftEvent = () => {
	const { graph, apis } = useContext(GraphinContext);
	const [showDetail, setShowDetail] = React.useState(false);
	const [detailData, setDetailData] = React.useState({});
	useEffect(() => {
		const handleNodeClick = (evt: IG6GraphEvent) => {
			const node = evt.item as INode;
			const model = node.getModel() as NodeConfig;
			console.log(model, 8888888888888);
			apis.focusNodeById(model.id);
			setDetailData(model.attrs);
			setShowDetail(true);
		};

		const handleCanvasClick = (evt: IG6GraphEvent) => {
			setShowDetail(false);
		};
		// 点击节点
		graph.on('node:click', handleNodeClick);
		//点计画布
		graph.on('canvas:click', handleCanvasClick);
		return () => {
			graph.off('node:click', handleNodeClick);
			graph.off('canvas:click', handleCanvasClick);
		};
	}, []);
	return <>{showDetail ? <DetailInfo detailData={detailData} /> : null}</>;
};

const MyMenu = React.memo((props: MenuProps) => {
	const { id, onClose, updateData, curData } = props;
	const orginId = id?.split('-')[0] || ''; //还原数据库id
	console.log(orginId, 121212);
	const [relArr, setRelARR] = React.useState([]);
	useEffect(() => {
		if (orginId) {
			getRelationships();
		}
	}, []);

	const getRelationships = () => {
		getNextRelationships({ nodeId: orginId }).then((res) => {
			setRelARR(res);
		});
	};

	// 选中数据
	const [checkedRel, setCheckedRel] = React.useState([]);
	const onChange = (checkedValues: CheckboxValueType[]) => {
		setCheckedRel(checkedValues);
	};

	// 穿透到下一层
	const showNextLeval = () => {
		const oldData = {
			nodes: curData.nodes,
			edges: curData.edges
		};
		updateData({
			nodes: [],
			edges: []
		}); //先置空不然渲染有问题
		getNextGraph({ nodeId: orginId, relationships: checkedRel }).then(
			(res: any) => {
				const map = new Map();
				const newData = {
					//拼接原有数据并去重
					nodes: [...oldData.nodes, ...res.nodes].filter(
						(v) => !map.has(v.id) && map.set(v.id, 1)
					),
					edges: [...oldData.edges, ...res.edges].filter(
						(v) => !map.has(v.id) && map.set(v.id, 1)
					)
				};

				updateData(newData);
				onClose();
			}
		);
	};
	return (
		<div className={styles['check-group-box']}>
			<div className={styles['relation-title']}>穿透下一层</div>
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
			<div className={styles['relation-bottom']}>
				<span
					className={styles['sub-button']}
					onClick={() => {
						showNextLeval();
					}}
				>
					确定
				</span>
			</div>
		</div>
	);
});
const formatGraphData = (data: IGraphData): GraphinData => {
	const { edges, nodes } = Object.assign({}, data);

	const formatEdges = edges.map((edge) => {
		const { type, similarity, id, source, target } = edge;
		return {
			...edge,
			type: 'graphin-line',
			id: id + '-edge',
			source: source + '-node',
			target: target + '-node',
			style: {
				label: {
					value: type
				},
				keyshape: {
					lineWidth: 1 + (similarity || 0) * 4
				}
			}
		};
	});

	const polyEdges = Utils.processEdges([...formatEdges]);

	const averageScore =
		nodes.reduce((acc, curr) => acc + (curr?.score || 0), 0) / nodes.length;

	const formatNodes = nodes.map((node) => {
		const { type, score, communityId, id, isCenter = false } = node;
		return {
			...node,
			id: id + '-node',
			type: 'Base',
			config: {
				// type决定color
				type: isCenter ? '中心节点' : type,
				// 最小值为100, 最大200
				size: score
					? Math.min(Math.max((score / averageScore) * 200, 100), 200)
					: 100,
				communityId
			}
		};
	});

	return {
		edges: polyEdges,
		nodes: formatNodes
	};
};
const GraphinCom = React.memo((props: Props) => {
	const { data, updateData, refersh } = props;
	const formatData = formatGraphData(data);
	const [key, setKey] = useState('');
	const curData = { ...data }; //当前图谱数据  穿透下一层时需要拼接数据
	const [width, setWidth] = useState(600);
	const graphinRef = useRef<HTMLDivElement>();

	useEffect(() => {
		const rect = graphinRef?.current?.getBoundingClientRect();
		setWidth(rect?.width as number);
	}, []);

	useEffect(() => {
		const rect = graphinRef?.current?.getBoundingClientRect();
		setKey(`${rect?.width}`);
		setWidth(rect?.width as number);
	}, [refersh]);

	return (
		<div ref={graphinRef} className={styles['graphin-box']}>
			<Graphin
				key={key}
				data={formatData}
				width={width}
				layout={{
					type: 'force',
					// linkDistance: 400,
					preventOverlap: true,
					nodeSize: 200,
					nodeSpacing: 50
					// animation: false
				}}
			>
				<Tooltip bindType="edge" placement={'top'} style={{ width: 'auto' }}>
					{(value: TooltipValue) => {
						if (value.model && value.model.attrs && value.model.attrs.length) {
							const { model } = value;
							return <EdgeDetail nodeModel={model} />;
						}
						return null;
					}}
				</Tooltip>
				<ContextMenu
					style={{ width: 'auto', background: '#fff' }}
					bindType="node"
				>
					{(value) => {
						const { onClose, id } = value;
						return (
							<MyMenu
								onClose={onClose}
								id={id}
								updateData={updateData}
								curData={curData}
							/>
						);
					}}
				</ContextMenu>
				{/*color: data中的 style.keyshape.fill || style.color*/}
				<Legend bindType="node" sortKey="config.type">
					{(renderProps: LegendChildrenProps) => {
						return (
							<Legend.Node
								{...renderProps}
								onChange={(checkedValue, result) => {
									console.log(
										'click legend',
										checkedValue,
										result,
										renderProps
									);
								}}
							/>
						);
					}}
				</Legend>
				<LeftEvent></LeftEvent>
			</Graphin>
		</div>
	);
});

export default GraphinCom;
