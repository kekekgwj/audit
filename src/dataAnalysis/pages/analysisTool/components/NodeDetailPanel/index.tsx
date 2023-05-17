import React, { useContext } from 'react';
import { Table } from 'antd';
import { useSelector } from 'react-redux';
import classes from './index.module.less';
import { JoinConfigPanel } from '../ConfigPanel';
import { ColumnsType } from 'antd/es/table';
import ASSETS from '../../assets/index';
import { IRootState } from '@/redux/store';
import { CloseOutlined } from '@ant-design/icons';
import { dispatch } from '@/redux/store';
import { toClosePanel } from '@/redux/reducers/dataAnalysis';
import { useGraph } from '../../lib/Graph';
import { IImageTypes, getNodeTypeById } from '../../lib/utils';
const { DOWNLOAD } = ASSETS;
const Panel: React.FC = () => {
	const state = useSelector((state: IRootState) => state.dataAnalysis);
	const graph = useGraph();

	const { curSelectedNode: id, showPanel } = state || {};
	if (!showPanel || !graph) {
		return null;
	}
	interface DataType {
		key: React.Key;
		name: string;
		age: number;
		address: string;
	}
	const { CONNECT, FILTER, TABLE } = IImageTypes;
	const clickNodeType = getNodeTypeById(graph, id)[0] as IImageTypes;

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

	const closePanel = () => {
		dispatch(toClosePanel());
	};
	return (
		<div className={classes.container}>
			<div className={classes.data}>
				<div className={classes.download}>
					<img src={DOWNLOAD} className={classes.download_icon}></img>
					<span className={classes.download_text}>下载</span>
					<CloseOutlined className={classes.closeIcon} onClick={closePanel} />
				</div>
				<div className={classes.tableWrapper}>
					<Table
						columns={columns}
						dataSource={data}
						pagination={{ defaultPageSize: 4 }}
					/>
				</div>
			</div>
			{/* <div className={classes.divider}></div> */}
			<div className={classes.configPanel}>
				<div className={classes.configPanel_title}>
					<span className={classes.configPanel_title_text}>参数配置</span>
					<CloseOutlined className={classes.closeIcon} onClick={closePanel} />
				</div>
				<div className={classes.configWrapper}>
					<JoinConfigPanel />
				</div>
			</div>
		</div>
	);
};

export default Panel;
