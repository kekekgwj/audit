import { Outlet } from 'react-router-dom';
import SiderBar from './sidebar';
import styles from './index.module.less';
import React from 'react';
import { getMyAltasList } from '@/api/knowledgeGraph/myAltas';

export default () => {
	React.useEffect(() => {
		getMyAltasList();
	}, []);
	return (
		<div className={styles.app}>
			<div className={styles.sidebar}>
				<SiderBar></SiderBar>
			</div>
			<div className={styles.main}>
				<Outlet />
			</div>
		</div>
	);
};
