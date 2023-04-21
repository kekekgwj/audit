import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { type GraphinData } from '@antv/graphin';
import GraphinCom from '@/components/graphin';
import SideBar from '@/components/sidebar/sideBar';
import styles from './index.module.less';
import { getBodyGraphin } from '@/api/graphin';

const RelationShipCom = () => {
	// 数据来源
	const [data, setDate] = useState<GraphinData>();

	useEffect(() => {
		getGraphinData();
	}, []);

	const getGraphinData = async () => {
		const data = await getBodyGraphin();
		updateData(data);
	};

	// 更新数据
	const updateData = (value: GraphinData) => {
		console.log(value, 107777);
		setDate(value);
	};

	return (
		<div className={styles['main-content']}>
			<div className={styles['filter-bar']}>
				<SideBar updateData={updateData}></SideBar>
			</div>
			<div className={styles['graphin-box']}>
				{data && (
					<>
						<div className={styles['graphin-box__com']}>
							<GraphinCom
								data={data}
								updateData={updateData}
								onClose={() => {}}
							></GraphinCom>
						</div>
						<div className={styles['graphin-box__btn']}>
							<Button
								htmlType="button"
								style={{ background: '#23955C', color: '#fff' }}
							>
								保存图谱
							</Button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default RelationShipCom;
