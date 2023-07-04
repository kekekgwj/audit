import {
	INextGraphParam,
	getNextRelationships
} from '@/api/knowLedgeGraph/graphin';

import { Checkbox, Col, Row } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import React, { useEffect } from 'react';
import { Components } from '@antv/graphin';
import styles from './index.module.less';

import { onSetSelectID } from '@/redux/store';
import { useGraphContext } from '../../hooks';
interface MenuProps {
	onClose: () => void;

	id?: string;
}
const { ContextMenu } = Components;

const RightMenu = () => {
	return (
		<ContextMenu style={{ width: 'auto', background: '#fff' }} bindType="node">
			{(value) => {
				const { onClose, id } = value;
				return <MyMenu onClose={onClose} id={id} />;
			}}
		</ContextMenu>
	);
};

const MyMenu = React.memo((props: MenuProps) => {
	const { data, setNextGraphInfo, getNextGraphInfo, searchNewGraph } =
		useGraphContext();
	if (!data) {
		return <></>;
	}
	const { id, onClose } = props;
	const orginId = id?.split('-')[0] || ''; //还原数据库id
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
	const savedRelations = getNextGraphInfo(parseInt(orginId));
	// 选中数据

	const onChange = (checkedValues: CheckboxValueType[]) => {
		setNextGraphInfo({
			nodeID: Number(orginId),
			relations: checkedValues as string[]
		});
	};
	// 点击查询：穿透到下一层
	const showNextLeval = () => {
		// for 移动到中心节点
		onSetSelectID({ selectID: orginId + '-node' });
		// const nextGraph = getNextGraphInfo(Number(orginId));
		// const searchParam: INextGraphParam = {
		// 	nodeId: Number(orginId),
		// 	relationships: nextGraph
		// };

		searchNewGraph();
		// 关闭弹窗
		onClose();
	};
	return (
		<div className={styles['check-group-box']}>
			<div className={styles['relation-title']}>穿透下一层</div>
			<div className={styles['relationShipTip']}>
				<Checkbox.Group
					style={{ width: '100%' }}
					onChange={onChange}
					className={styles['relationGroup']}
					defaultValue={savedRelations || []}
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

export default RightMenu;
