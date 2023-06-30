import {
	IGraphData,
	getNextGraph,
	getNextRelationships
} from '@/api/knowLedgeGraph/graphin';

import { Checkbox, Col, Row } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import React, { useContext, useEffect, useRef } from 'react';
import { Components } from '@antv/graphin';
import styles from './index.module.less';
import { useGraphContext } from '..';
import { GraphinContext } from '@antv/graphin/lib';
import { onSetSelectID } from '@/redux/store';
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
	const { curData, updateData, setNextGraphInfo, getNextGraphInfo } =
		useGraphContext();
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
		const { nodes: curNodes, edges: curEdges } = curData as IGraphData;

		// for 移动到中心节点
		onSetSelectID({ selectID: orginId + '-node' });
		getNextGraph({ nodeId: orginId, relationships: checkedRel }).then((res) => {
			const { nodes, edges } = res || {};
			console.log('nodes', nodes, edges, checkedRel);
			const prevNodesID = curNodes.map((node) => node.id);
			const prevEdgesID = curEdges.map((edge) => edge.id);
			const addNodes = nodes.filter((node) => !prevNodesID.includes(node.id));
			const addEdges = edges.filter((edge) => !prevEdgesID.includes(edge.id));

			const addNodesID = addNodes.map((node) => node.id);
			const addEdgesID = addEdges.map((edge) => edge.id);
			setNextGraphInfo({
				nodeID: orginId,
				// nodes: addNodesID,
				// edges: addEdgesID,
				relations: checkedRel
			});
			const newData = {
				//拼接原有数据并去重
				nodes: [...curNodes, ...addNodes],
				edges: [...curEdges, ...addEdges]
			};
			updateData(newData);
			onClose();
		});
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
