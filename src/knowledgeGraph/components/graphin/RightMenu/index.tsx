import {
	getNextGraph,
	getNextRelationships
} from '@/api/knowLedgeGraph/graphin';

import { Checkbox, Col, Row } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import React, { useEffect } from 'react';
import { Components } from '@antv/graphin';
import styles from './index.module.less';
import { useGraphContext } from '..';
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
	const { curData, updateData } = useGraphContext();
	console.log('curData', curData, updateData);
	if (!curData || !updateData) {
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

export default RightMenu;
