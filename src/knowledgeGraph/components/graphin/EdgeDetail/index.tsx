import { ModelConfig } from '@antv/g6';
import { Components, type TooltipValue } from '@antv/graphin';
import React from 'react';
import styles from './index.module.less';
interface NodeDetailProps {
	nodeModel: ModelConfig;
}
const { Tooltip, ContextMenu } = Components;
export default () => {
	return (
		<Tooltip bindType="edge" placement={'top'} style={{ width: 'auto' }}>
			{(value: TooltipValue) => {
				if (value.model && value.model.attrs && value.model.attrs.length) {
					const { model } = value;
					return <EdgeDetail nodeModel={model} />;
				}
				return null;
			}}
		</Tooltip>
	);
};

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
