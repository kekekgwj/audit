import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { type GraphinData } from '@antv/graphin';
import html2canvas from 'html2canvas';
import GraphinCom from '@/components/graphin';
import SideBar from '@/components/sidebar/sideBar';
import { toImgStyle } from '@/utils/other';
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

	// 保存图谱
	const saveGraph = () => {
		console.log('1111');
		window.pageYOffset = 0; //网页位置
		document.documentElement.scrollTop = 0; //滚动条的位置
		document.body.scrollTop = 0; //网页被卷去的高
		//获取要生成图片的dom区域并转为canvas;
		html2canvas(document.querySelector('#graphin-container')).then((canvas) => {
			const base64Img = canvas.toDataURL('image/png'); //将canvas转为base64

			const file = toImgStyle(base64Img, Date.now() + '.png');
			//调用后端接口，将文件传给后端
		});
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
								onClick={() => {
									saveGraph();
								}}
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
