import React, { useEffect, useRef } from 'react';
import { Card, Divider, Form, Input } from 'antd';
import fileImg from '@/assets/img/file.png';
import styles from './index.module.less';
import SvgIcon from '@/components/svg-icon';

const AuditTemplate = () => {
	const [templateList, setTemplateList] = React.useState([]);
	useEffect(() => {
		getTemplateList();
	}, []);
	// 获取模板列表数据
	const getTemplateList = () => {
		const data = [
			{ name: '模板一', createTime: '2023-05-23', id: 1 },
			{ name: '模板二', createTime: '2023-05-23', id: 2 },
			{ name: '模板三', createTime: '2023-05-23', id: 3 }
		];
		setTemplateList(data);
	};

	//复制
	const handleCopy = (item) => {
		console.log(item.id);
	};

	return (
		<div className={styles['audit-template-page']}>
			{templateList &&
				templateList.length > 0 &&
				templateList.map((item) => {
					return (
						<Card key={item.id} className={styles['card-item']}>
							<div className={styles['card-content']}>
								<div className={styles['img-icon']}>
									<img src={fileImg} alt="" />
								</div>
								<div className={styles['text-name']}>{item.name}</div>
								<div className={styles['text-time']}>
									最近更新：{item.createTime}
								</div>
							</div>
							<div className={styles['card-footer']}>
								<span
									className={styles['operate-item']}
									onClick={() => handleCopy(item)}
								>
									<SvgIcon name="copy" color="#24A36F"></SvgIcon>
									<span style={{ marginLeft: '2px' }}>复制</span>
								</span>
							</div>
						</Card>
					);
				})}
		</div>
	);
};

export default AuditTemplate;
