import React, { useContext, useState } from 'react';
import classes from './index.module.less';
import { Collapse } from 'antd';
const { Panel } = Collapse;
import { GraphContext } from '../../lib';
import TABLE from '@/assets/SQLEditor/table.png';
import { IImageTypes } from '../../lib';
const TableItem: React.FC = ({ data }) => {
	if (!data) {
		return null;
	}
	const { startDrag } = useContext(GraphContext) || {};
	return (
		<Collapse
			className={classes.tableItemWrapper}
			expandIconPosition={'start'}
			ghost={true}
		>
			<Panel
				header={
					<>
						<span className={classes.iconGroup}></span>
						<span className={classes.title}>{data.title}</span>
					</>
				}
				className={classes.itemTitle}
				key="panel"
			>
				{data.tables &&
					data.tables.map((table, index) => {
						return (
							<div
								className={classes.textWrapper}
								key={index}
								onMouseDown={(e) =>
									startDrag &&
									startDrag(e, {
										label: table.tableName || '',
										image: TABLE,
										type: IImageTypes.TABLE
									})
								}
							>
								<span className={classes.iconTable}></span>
								<span className={classes.tableName}>{table.tableName}</span>
							</div>
						);
					})}
			</Panel>
		</Collapse>
	);
};
interface IProps {
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	open: boolean;
}
const TableSourcePanel: React.FC<IProps> = ({ setOpen, open }) => {
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
