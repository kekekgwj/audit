import React, { useState } from 'react';
import classes from './index.module.less';
import { Collapse } from 'antd';
const { Panel } = Collapse;

const TableItem: React.FC = ({ data }) => {
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
				header={
					<>
						<image className={classes.iconGroup}></image>
						<span className={classes.title}>{data.title}</span>
					</>
				}
				className={classes.itemTitle}
			>
				{data.tables &&
					data.tables.map((table) => {
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

const TableSourcePanel: React.FC = () => {
	const [open, setOpen] = useState<boolean>(true);
	const onClickSwitch = () => {
		setOpen(!open);
	};
	const data1 = {
		title: '系统数据',
		tables: [
			{
				tableName: '数据表名称1'
			},
			{
				tableName: '数据表名称2'
			},
			{
				tableName: '数据表名称3'
			},
			{
				tableName: '数据表名称4'
			}
		]
	};
	const data2 = {
		title: '我的数据',
		tables: [
			{
				tableName: '数据表名称1'
			},
			{
				tableName: '数据表名称2'
			},
			{
				tableName: '数据表名称3'
			},
			{
				tableName: '数据表名称4'
			}
		]
	};
	return (
		<div className={classes.drawerWrapper}>
			{open && (
				<div className={classes.container}>
					<TableItem data={data1}></TableItem>
					<TableItem data={data2}></TableItem>
				</div>
			)}

			<div className={classes.switch} onClick={onClickSwitch}>
				{open ? '<<' : '>>'}
			</div>
		</div>
	);
};
export default TableSourcePanel;
