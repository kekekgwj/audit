import React, { useContext, useState } from 'react';
import classes from './index.module.less';
import { Collapse, Input } from 'antd';
const { Search } = Input;
const { Panel } = Collapse;
import { GraphContext } from '../../lib';
import TABLE from '@/assets/SQLEditor/table.png';
import { IImageTypes } from '../../lib/utils';
import SvgIcon from '@/components/svg-icon';
import { SearchOutlined } from '@ant-design/icons';
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
					<span className={classes.itemTitleBox}>
						{/* <span className={classes.iconGroup}></span> */}
						<SvgIcon name="filter"></SvgIcon>
						<span className={classes.title}>{data.title}</span>
					</span>
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
								{/* <span className={classes.iconTable}></span> */}
								<SvgIcon name="group"></SvgIcon>
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
	// 搜索查询
	const onSearch = () => {};
	return (
		<div className={classes.drawerWrapper}>
			{open && (
				<div className={classes.container}>
					<div style={{ paddingRight: '15px' }}>
						<Search
							placeholder="请输入关键字"
							enterButton="查询"
							size="middle"
							prefix={<SearchOutlined className="site-form-item-icon" />}
							onSearch={onSearch}
						/>
					</div>
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
