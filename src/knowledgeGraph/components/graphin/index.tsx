import React, { useContext, useEffect, useRef, useState } from 'react';
import Graphin, {
	Components,
	IG6GraphEvent,
	GraphinContext,
	type TooltipValue,
	type GraphinData,
	type LegendChildrenProps
} from '@antv/graphin';
import registerNodes from './custom-node';
import registerEdges from './custom-edge';
import styles from './index.module.less';
import { INode, ModelConfig, NodeConfig } from '@antv/g6';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { Checkbox, Col, Row } from 'antd';
import { getNextGraph } from '@/api/knowledgeGraph/graphin';

// 注册自定义节点
registerNodes('all');
registerEdges('all');

//功能组件
const { Tooltip, ContextMenu, Legend } = Components;

interface Props {
	data: GraphinData;
	refersh: boolean;
	updateData: (data: GraphinData) => void;
	onClose: () => void;
	id?: string;
}

interface MenuProps {
	onClose: () => void;
	updateData: (data: GraphinData) => void;
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
			console.log(node, 8888888888888);
			apis.focusNodeById(model.id);
			setDetailData(model);
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
	const { data, id, onClose, updateData } = props;
	useEffect(() => {
		getNext();
	}, []);

	const getNext = () => {
		getNextGraph({ nodeId: id }).then((res) => {
			console.log(res, 119119);
		});
	};
	const relArr = ['同事', '朋友', '合作方'];
	// 选中数据
	const [checkedRel, setCheckedRel] = React.useState([]);
	const onChange = (checkedValues: CheckboxValueType[]) => {
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
	const { data, updateData, refersh } = props;
	const [key, setKey] = useState('');
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
				data={data}
				width={width}
				layout={{
					type: 'force',
					// linkDistance: 400,
					preventOverlap: true,
					nodeSize: 140,
					nodeSpacing: 50
					// animation: false
				}}
			>
				<Tooltip bindType="edge" placement={'top'}>
					{(value: TooltipValue) => {
						if (value.model) {
							const { model } = value;
							return <EdgeDetail nodeModel={model} />;
						}
						return null;
					}}
				</Tooltip>
				<ContextMenu style={{ background: '#fff' }} bindType="node">
					{(value) => {
						const { onClose, id } = value;
						return <MyMenu onClose={onClose} id={id} updateData={updateData} />;
					}}
				</ContextMenu>
				<Legend bindType="node" sortKey="typeName">
					{(renderProps: LegendChildrenProps) => {
						return <Legend.Node {...renderProps} />;
					}}
				</Legend>
				<LeftEvent></LeftEvent>
			</Graphin>
		</div>
	);
});

export default GraphinCom;
