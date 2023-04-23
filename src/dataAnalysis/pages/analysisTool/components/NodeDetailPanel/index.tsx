import React from 'react';
import { Collapse, Table } from 'antd';
import { useSelector } from 'react-redux';
import classes from './index.module.less';
import { IGlobalState } from '../../../../../redux/reducers';
import { JoinConfigPanel } from '../ConfigPanel';
import { ColumnsType } from 'antd/es/table';
const Panel: React.FC = () => {
	const state = useSelector((state: IGlobalState) => state.dataAnaylsis);
	const { curSelectedNode: id, showPanel } = state;
	interface DataType {
		key: React.Key;
		name: string;
		age: number;
		address: string;
	}

	const columns: ColumnsType<DataType> = [
		{
			title: 'Name',
			dataIndex: 'name'
		},
		{
			title: 'Age',
			dataIndex: 'age'
		},
		{
			title: 'Address',
			dataIndex: 'address'
		}
	];
	const data: DataType[] = [];
	for (let i = 0; i < 46; i++) {
		data.push({
			key: i,
			name: `Edward King ${i}`,
			age: 32,
			address: `London, Park Lane no. ${i}`
		});
	}
	return (
		<div className={classes.container}>
			<div className={classes.configPanel}>
				<JoinConfigPanel />
			</div>
			<div className={classes.data}>
				<Table columns={columns} dataSource={data} />;
			</div>
		</div>
	);
};

export default Panel;
