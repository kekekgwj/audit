import React, { useContext, useState, useEffect } from 'react';
import classes from './index.module.less';
import { Collapse, Input } from 'antd';
const { Search } = Input;
const { Panel } = Collapse;
import { GraphContext } from '../../lib';
import TABLE from '@/assets/SQLEditor/table.png';
import { IImageTypes } from '../../lib/utils';
import SvgIcon from '@/components/svg-icon';
import { SearchOutlined } from '@ant-design/icons';
import { getTablesData } from '@/api/dataAnalysis/graph';
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

	const [systemData, setSystemData] = useState({}); //系统数据
	const [myData, setMyData] = useState({}); //我的数据
	const [searchData, setSearchData] = useState({}); //搜索数据
	const [showSearch, setShowSearch] = useState(false); //展示搜索数据

	useEffect(() => {
		getSystemData();
		getMyData();
	}, []);
	//系统数据
	const getSystemData = async () => {
		try {
			const res = await getTablesData({ queryType: 1 });
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
			const res = await getTablesData({ queryType: 2 });
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
		try {
			const res = await getTablesData({ queryType: 3, tableCnName: val });
			const data = {
				title: '搜索结果',
				tables: res
			};
			setSearchData(data);
			setShowSearch(true);
		} catch (e) {
			console.error(e);
		}
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
					<div style={{ paddingRight: '15px' }}>
						<Search
							placeholder="请输入关键字"
							enterButton="查询"
							size="middle"
							prefix={<SearchOutlined className="site-form-item-icon" />}
							onSearch={onSearch}
							onChange={changeSearch}
						/>
					</div>
					<div style={{ height: ' calc(100% - 32px)', overflowY: 'auto' }}>
						{showSearch ? (
							<TableItem data={searchData}></TableItem>
						) : (
							<>
								<TableItem data={systemData}></TableItem>
								<TableItem data={myData}></TableItem>
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
