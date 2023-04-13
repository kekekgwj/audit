import React from 'react';
import { Collapse, Table } from 'antd';
import { useSelector } from 'react-redux';
import classes from './index.module.less';
import { IGlobalState } from '../../../../redux/reducers';
import { JoinConfigPanel } from '../ConfigPanel';
const Panel: React.FC = () => {
	const state = useSelector((state: IGlobalState) => state.dataAnaylsis);
	const { curSelectedNode: id, showPanel } = state;
	return (
		<div className={classes.container}>
			<>{id}</>
			<JoinConfigPanel></JoinConfigPanel>
			{/* <Table></Table> */}
		</div>
	);
};

export default Panel;
