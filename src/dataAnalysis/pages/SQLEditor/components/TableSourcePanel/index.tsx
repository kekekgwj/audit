import React from 'react';
import classes from './index.module.less';

const TableItem: React.FC = ({ data }) => {
	if (!data) {
		return null;
	}
	return (
		<div className={classes.tableItemWrapper}>
			<div className={classes.itemTitle}>
				<image className={classes.iconGroup}></image>
				<span className={classes.title}>{data.title}</span>
			</div>
			{data.tables &&
				data.tables.map((table) => {
					return (
						<div className={classes.textWrapper}>
							<span className={classes.iconTable}></span>
							<span className={classes.tableName}>{table.tableName}</span>
						</div>
					);
				})}
		</div>
	);
};

const TableSourcePanel: React.FC = () => {
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
		<div
			// onClose={onClose}
			// open={open}
			className={classes.container}
		>
			<TableItem data={data1}></TableItem>
			<TableItem data={data2}></TableItem>
			<div className={classes.switch}>{'<<'}</div>
		</div>
	);
};
export default TableSourcePanel;
