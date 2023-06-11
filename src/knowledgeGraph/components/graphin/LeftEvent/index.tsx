import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { INode, ModelConfig, NodeConfig } from '@antv/g6';
import { IG6GraphEvent, GraphinContext } from '@antv/graphin';
interface DetailProps {
	detailData: ModelConfig;
}
import styles from './index.module.less';

const LeftEvent = () => {
	const { graph, apis } = useContext(GraphinContext);
	const [showDetail, setShowDetail] = useState(false);
	const [detailData, setDetailData] = useState({});
	const handleNodeClick = (evt: IG6GraphEvent) => {
		const node = evt.item as INode;
		const model = node.getModel() as NodeConfig;
		apis.focusNodeById(model.id);
		setDetailData(model.attrs);
		setShowDetail(true);
	};
	useEffect(() => {
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
export default LeftEvent;
