import React, { useContext, useEffect } from 'react';
import Graphin, {
	Behaviors,
	Components,
	IG6GraphEvent,
	Utils,
	GraphinContext,
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

//功能组件
const { Tooltip, ContextMenu, Legend } = Components;

const { Hoverable, ResizeCanvas } = Behaviors;

interface Props {
	data: GraphinData;
	updateData: (layout: any) => void;
	onClose: () => void;
	id?: string;
}

interface NodeDetailProps {
	nodeModel: ModelConfig;
}

const EdgeDetail = React.memo((props: NodeDetailProps) => {
	const { nodeModel } = props;
	return (
		<div className={styles['node-detail-box']}>
			<div className={styles['node-detail-item']}>
				<span className={styles['detail-item-title']}>边id:</span>
				{nodeModel.id as string}
			</div>
			<div className={styles['node-detail-item']}>
				<span className={styles['detail-item-title']}>边id:</span>
				{nodeModel.id as string}
			</div>
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
				<div className={styles['node-detail-item']}>
					<span className={styles['detail-item-title']}>节点id:</span>
					{detailData.id as string}
				</div>
				<div className={styles['node-detail-item']}>
					<span className={styles['detail-item-title']}>节点id:</span>
					{detailData.id as string}
				</div>
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
			apis.focusNodeById(model.id);
			setDetailData(model);
			setShowDetail(true);
			console.log(showDetail, 24111111);
		};

		const handleCanvasClick = (evt: IG6GraphEvent) => {
			setShowDetail(false);
			console.log(showDetail, 2466666);
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

const MyMenu = React.memo((props: Props) => {
	const { data, id, onClose, updateData } = props;
	const relArr = ['同事', '朋友', '合作方'];
	// 选中数据
	const [checkedRel, setCheckedRel] = React.useState([]);
	const onChange = (checkedValues: CheckboxValueType[]) => {
		console.log('checked = ', checkedValues);
		setCheckedRel(checkedValues);
	};

	// 穿透到下一层
	const showNextLeval = () => {
		console.log(checkedRel, 2855555);

		// onClose();
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
			{/* <Tooltip bindType="node" placement={'top'}>
				{(value: TooltipValue) => {
					if (value.model) {
						const { model } = value;
						console.log(model, 421111111);
						return <NodeDetail nodeModel={model} />;
					}
					return null;
				}}
			</Tooltip> */}
			<Tooltip bindType="edge" placement={'top'}>
				{(value: TooltipValue) => {
					if (value.model) {
						const { model } = value;
						console.log(model, 42222222222);
						return <EdgeDetail nodeModel={model} />;
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
			<LeftEvent></LeftEvent>
			<Hoverable bindType="node" />
			<ResizeCanvas></ResizeCanvas>
		</Graphin>
	);
});

export default GraphinCom;
