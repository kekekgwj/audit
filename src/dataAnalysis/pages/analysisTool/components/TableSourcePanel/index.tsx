import React, { useContext, useState, useEffect } from 'react';
import classes from './index.module.less';
import { Collapse, Input, Tooltip, message } from 'antd';
const { Search } = Input;
const { Panel } = Collapse;
import { GraphContext, useGraphContext } from '../../lib';
import TABLE from '@/assets/SQLEditor/table.png';
import { IImageTypes } from '../../lib/utils';
import SvgIcon from '@/components/svg-icon';
import { SearchOutlined } from '@ant-design/icons';
import { getTablesData } from '@/api/dataAnalysis/graph';
import { getClassifiedTables } from '@/api/sqlEditor';

const TableItem: React.FC = ({ data, disabled }) => {
	if (!data) {
		return null;
	}
	const { startDrag } = useContext(GraphContext) || {};
	return (
		<Collapse
			className={classes.tableItemWrapper}
			expandIconPosition="end"
			ghost={true}
			defaultActiveKey={['panel']}
		>
			<Panel
				header={
					<span className={classes.itemTitleBox}>
						<SvgIcon name="filter"></SvgIcon>
						<span className={classes.title}>{data.title}</span>
					</span>
				}
				className={classes.itemTitle}
				key="panel"
			>
				{data.tables && data.tables.length ? (
					data.tables.map((table, index) => {
						return (
							<div
								className={classes.textWrapper}
								key={index}
								onMouseDown={(e) =>
									startDrag &&
									startDrag(e, {
										label: table.tableName || '',
										labelCn: table.tableCnName || '',
										image: TABLE,
										type: IImageTypes.TABLE
									})
								}
							>
								<span className={classes.iconTable}></span>
								<Tooltip
									title={
										table.tableCnName ? table.tableCnName : table.tableName
									}
								>
									<span
										className={classes.tableName}
										style={disabled ? { color: 'rgba(0, 0, 0, 0.25)' } : {}}
									>
										{table.tableCnName ? table.tableCnName : table.tableName}
									</span>
								</Tooltip>
							</div>
						);
					})
				) : (
					<div className={classes.textWrapper}>暂无数据</div>
				)}
				{/* {data.tables &&
					data.tables.map((table, index) => {
						return (
							<div
								className={classes.textWrapper}
								key={index}
								onMouseDown={(e) =>
									startDrag &&
									startDrag(e, {
										label: table.tableName || '',
										labelCn: table.tableCnName || '',
										image: TABLE,
										type: IImageTypes.TABLE
									})
								}
							>
								<span className={classes.iconTable}></span>
								<span className={classes.tableName}>
									{table.tableCnName ? table.tableCnName : table.tableName}
								</span>
							</div>
						);
					})} */}
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

	const [systemData, setSystemData] = useState({}); //系统数据
	const [myData, setMyData] = useState({}); //我的数据
	const [searchData, setSearchData] = useState([]); //搜索数据
	const [showSearch, setShowSearch] = useState(false); //展示搜索数据
	const [table, setTable] = useState([]); // 表
	const { isPublicTemplate } = useGraphContext();
	useEffect(() => {
		// getSystemData();
		// getMyData();
		getTables();
	}, []);

	const getTables = async () => {
		const res = await getClassifiedTables({
			keyword: ''
		});

		setTable(
			res.map((item) => ({
				title: item.name,
				tables: item.tables
			}))
		);
	};

	//系统数据
	const getSystemData = async () => {
		try {
			const res = await getTablesData({ queryType: 1, orderBy: 2 });
			const data = {
				title: '系统数据',
				tables: res
			};
			setSystemData(data);
		} catch (e) {
			console.error(e);
		}
	};

	const getMyData = async () => {
		try {
			const res = await getTablesData({ queryType: 2, orderBy: 2 });
			const data = {
				title: '我的数据',
				tables: res
			};

			setMyData(data);
		} catch (e) {
			console.error(e);
		}
	};

	// 搜索查询
	const onSearch = async (val: string) => {
		if (!val) {
			setShowSearch(false);
			return;
		}
		const res = await getClassifiedTables({
			keyword: val
		});
		if (!res.length) {
			message.warning('暂无数据');
		}
		setSearchData(
			res.map((item) => ({
				title: item.name,
				tables: item.tables
			}))
		);
		setShowSearch(true);

		// try {
		// 	const res = await getTablesData({
		// 		queryType: 3,
		// 		keyword: val,
		// 		orderBy: 2
		// 	});
		// 	const data = {
		// 		title: '搜索结果',
		// 		tables: res
		// 	};
		// 	setSearchData(data);
		// 	setShowSearch(true);
		// } catch (e) {
		// 	console.error(e);
		// }
	};
	const changeSearch = (e: any) => {
		// 没有数据，关闭搜索
		if (!e.target.value) {
			setShowSearch(false);
		}
	};
	return (
		<div className={classes.drawerWrapper}>
			{open && (
				<div className={classes.container}>
					<div style={{ paddingRight: '15px', marginBottom: '20px' }}>
						<Search
							placeholder="请输入关键字"
							enterButton="查询"
							size="middle"
							prefix={<SearchOutlined className="site-form-item-icon" />}
							onSearch={onSearch}
							onChange={changeSearch}
						/>
					</div>
					<div
						style={{
							height: ' calc(100% - 32px)',
							overflowY: 'auto',
							paddingBottom: '20px'
						}}
					>
						{showSearch ? (
							// <TableItem data={searchData}></TableItem>
							<>
								{searchData.map((item) => (
									<TableItem
										data={item}
										disabled={isPublicTemplate}
									></TableItem>
								))}
							</>
						) : (
							<>
								{table.map((item) => (
									<TableItem
										data={item}
										disabled={isPublicTemplate}
									></TableItem>
								))}
								{/* <TableItem
									data={systemData}
									disabled={isPublicTemplate}
								></TableItem>
								<TableItem
									data={myData}
									disabled={isPublicTemplate}
								></TableItem> */}
							</>
						)}
					</div>
				</div>
			)}

			<div className={classes.switch} onClick={onClickSwitch}>
				{/* {open ? '<<' : '>>'} */}
				{open ? (
					<SvgIcon name="closeArrow" className={classes.closeIcon}></SvgIcon>
				) : (
					<SvgIcon name="openArrow" className={classes.closeIcon}></SvgIcon>
				)}
			</div>
		</div>
	);
};
export default TableSourcePanel;
