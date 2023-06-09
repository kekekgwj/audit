import React, { useEffect } from 'react';
import { getDeatil } from '@/api/knowLedgeGraph/myAltas';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table } from 'antd';

import styles from './index.module.less';
import SvgIcon from '@/components/svg-icon';
import { getMyTable } from '@/api/dataAnalysis/dataManage.ts';
const DataManageDetailCom = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const id = location.state.id;
	const [tableHead, setHead] = React.useState(); //表头
	const [data, setData] = React.useState(); //原始表数据
	const [tableData, setTableData] = React.useState([]); //渲染表数据
	//表格colums设置
	const [colums, setColums] = React.useState([]);
	useEffect(() => {
		if (id) {
			getMyTable({ id }).then((res: any) => {
				setData(res.data);
				setHead(res.head);
				if (res.data) {
					//存在表 渲染表数据
					setTableData(transToTableData(res.head, res.data));
				}
			});
		}
	}, [id]);

	// 根据表数据动态渲染表
	useEffect(() => {
		if (tableData && tableData.length > 0) {
			console.log(tableData, 303030);
			// 根据数据获取对应项
			// const arr = Object.keys(tableData[0]);
			const colums = tableHead.map((item, index) => {
				return {
					title: item,
					dataIndex: item,
					ellipsis: true
				};
			});
			setColums(colums);
		}
	}, [tableData]);

	// 获取数据转换成表格数据
	const transToTableData = (head: [], data: []) => {
		const tableDataArr = [];
		data.forEach((item) => {
			const newObj = {};
			item.forEach((el, i) => {
				newObj[head[i]] = el;
			});
			tableDataArr.push(newObj);
		});
		return tableDataArr;
	};

	const goBack = () => {
		navigate(-1);
	};

	return (
		<div className={styles['data-detail-page']}>
			<div className={styles['top-back-box']}>
				<span className={styles['rule-name']}></span>
				<span style={{ marginRight: '10px' }} onClick={() => goBack()}>
					<SvgIcon
						name="close"
						color="#23955C"
						className={styles['icon-close']}
					></SvgIcon>
				</span>
			</div>
			<div id="main-content" className={styles['main-content']}>
				<>
					{data ? (
						<div className={styles['table-box']}>
							<Table
								className={styles['my-table']}
								columns={colums}
								dataSource={tableData}
								pagination={false}
							></Table>
						</div>
					) : null}
				</>
			</div>
		</div>
	);
};

export default DataManageDetailCom;
