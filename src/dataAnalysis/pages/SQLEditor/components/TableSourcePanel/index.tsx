import React, { useEffect, useState } from 'react';
import classes from './index.module.less';
import { Collapse } from 'antd';
import { getMyTables, getSystemTables } from '@/api/sqlEditor';
const { Panel } = Collapse;

interface ITable {
	title: string;
	data: ITableData[];
}
interface ITableData {
	id?: number;
	tableCnName: string | null;
	tableName: string;
}

const TableItem: React.FC<ITable> = ({ data, title }) => {
	if (!data) {
		return null;
	}
	return (
		<Collapse
			className={classes.tableItemWrapper}
			expandIconPosition={'start'}
			ghost={true}
		>
			<Panel
				key={title}
				header={
					<>
						<image className={classes.iconGroup}></image>
						<span className={classes.title}>{title}</span>
					</>
				}
				className={classes.itemTitle}
			>
				{data &&
					data.map((table) => {
						return (
							<div className={classes.textWrapper}>
								<span className={classes.iconTable}></span>
								<span className={classes.tableName}>{table.tableName}</span>
							</div>
						);
					})}
			</Panel>
		</Collapse>
	);
};
const SystemTable: React.FC = () => {
	const [data, setData] = useState<ITable>();

	const handleTableData = async () => {
		const tableData = (await getSystemTables()) as ITableData[];
		setData({
			title: '系统数据',
			data: tableData
		});
	};
	useEffect(() => {
		handleTableData();
	}, []);
	if (!data || !data.data || !data.title) {
		return null;
	}
	return <TableItem data={data.data} title={data.title}></TableItem>;
};
const MyTable: React.FC = () => {
	const [data, setData] = useState<ITable>();

	const handleTableData = async () => {
		const tableData = (await getMyTables()) as ITableData[];
		setData({
			title: '系统数据',
			data: tableData
		});
	};
	useEffect(() => {
		handleTableData();
	}, []);
	if (!data || !data.data || !data.title) {
		return null;
	}
	return <TableItem data={data.data} title={data.title}></TableItem>;
};
const TableSourcePanel: React.FC = () => {
	const [open, setOpen] = useState<boolean>(true);
	const onClickSwitch = () => {
		setOpen(!open);
	};

	return (
		<div className={classes.drawerWrapper}>
			{open && (
				<div className={classes.container}>
					<SystemTable />
					<MyTable />
				</div>
			)}

			<div className={classes.switch} onClick={onClickSwitch}>
				{open ? '<<' : '>>'}
			</div>
		</div>
	);
};
export default TableSourcePanel;
