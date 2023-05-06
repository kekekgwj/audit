import React, { useEffect } from 'react';
import { getDeatil } from '@/api/knowledgeGraph/myAltas';
import { useLocation, useNavigate } from 'react-router-dom';
import { Image } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import styles from './detail.module.less';
const AltasDetailCom = () => {
	const navigate = useNavigate();
	let location = useLocation();
	const graphId = location.state.id;
	const [graphUrl, setGraphUrl] = React.useState('');
	useEffect(() => {
		getDeatil({ graphId }).then((res: any) => {
			setGraphUrl(res.picUrl);
		});
	}, [graphId]);

	const goBack = () => {
		navigate(-1);
	};

	return (
		<div className={styles['graph-detail-page']}>
			<div className={styles['img-box']}>
				<Image src={graphUrl} className={styles['img']} />
			</div>
			<div className={styles['close-goback']}>
				<CloseCircleOutlined
					style={{ color: '#23955C', fontSize: '20px' }}
					onClick={() => goBack()}
				/>
			</div>
		</div>
	);
};

export default AltasDetailCom;
