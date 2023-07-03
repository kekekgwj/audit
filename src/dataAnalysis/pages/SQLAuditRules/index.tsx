import { useRef, useState, useEffect } from 'react';
import { Button, Form, Input, Table, Pagination, Empty, Row, Col } from 'antd';
import type { PaginationProps } from 'antd';
import SvgIcon from '@/components/svg-icon';
import emptyPage from '@/assets/img/newEmpty.png';
// import DataTable from '@/components/data-table';
import Show from './components/show';

import { getAuditSqlPage } from '@/api/dataAnalysis/sql';

import styles from './index.module.less';

interface DataType {
	key: string;
	sqlName: string;
	sqlContent?: string;
	useTo: string;
}

export default () => {
	const tableRef = useRef();
	const [searchForm] = Form.useForm();
	const [currentRow, setCurrentRow] = useState<DataType>();
	const [openShow, setOpenShow] = useState(false);
	// 表数据
	const [tableData, setTableData] = useState([]);
	const [current, setCurrent] = useState(1);
	const [size, setSize] = useState(10);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		getData();
	}, [current, size]);

	const columns = [
		{
			title: '序号',
			width: 100,
			render: (text, record, index) => `${(current - 1) * size + index + 1}`
		},
		{
			title: '审计规则SQL编码',
			width: 200,
			dataIndex: 'code'
		},
		{
			title: '审计规则SQL名称',
			width: 200,
			dataIndex: 'sqlName'
		},
		{
			title: '规则描述',
			dataIndex: 'useTo',
			width: 300,
			ellipsis: true
		},
		{
			title: '操作',
			key: 'operaion',
			width: 200,
			render: (row, record) => {
				return (
					<div className={styles['operate-box']}>
						<span
							className={styles['operate-item']}
							onClick={() => {
								handleShow(row);
							}}
						>
							<SvgIcon name="see" color="#23955C"></SvgIcon>
							<span style={{ marginLeft: '2px' }}>查看</span>
						</span>
					</div>
				);
			}
		}
	];

	// 打开查看弹框
	const handleShow = (row: DataType) => {
		setCurrentRow(row);
		setOpenShow(true);
	};

	// 关闭查看弹框
	const handleCancelShow = () => {
		setOpenShow(false);
	};

	const getData = async () => {
		const res = await getAuditSqlPage({
			current: current,
			size: size,
			name: searchForm.getFieldsValue().sqlName || ''
		});

		const list: DataType[] = res.records.map((item) => ({
			key: item.id,
			sqlName: item.name,
			useTo: item.effect,
			code: item.code
		}));

		// return {
		// 	list,
		// 	total: res.total
		// };
		setTableData(list);
		setTotal(res.total);
	};

	const onShowSizeChange: PaginationProps['onShowSizeChange'] = (
		current: number,
		pageSize: number
	) => {
		setSize(pageSize);
	};

	const onChange: PaginationProps['onChange'] = (pageNumber: number) => {
		console.log('Page: ', pageNumber);
		setCurrent(pageNumber);
	};

	const onReset = () => {
		searchForm.resetFields();
		getData();
	};

	const search = () => {
		setCurrent(1);
		getData();
	};
	// const tableRefresh = () => {
	// 	tableRef.current.refresh();
	// };
	// const onReset = () => {
	// 	searchForm.resetFields();
	// 	tableRefresh();
	// };
	// const search = () => {
	// 	tableRefresh();
	// };

	return (
		<div style={{ padding: '20px' }} className={styles.sqlAuditBox}>
			<div className={styles.searchForm}>
				<Form
					style={{ width: 'calc(100% - 138px)' }}
					form={searchForm}
					labelCol={{ span: 6 }}
					wrapperCol={{ span: 18 }}
					layout="inline"
				>
					<Row style={{ width: '100%' }}>
						<Col span={8}>
							<Form.Item
								name="sqlName"
								label="审计规则SQL名称"
								labelCol={{ span: 10 }}
								wrapperCol={{ span: 14 }}
								colon={false}
							>
								<Input placeholder="请输入" className={styles.searchItem} />
							</Form.Item>
						</Col>
					</Row>
				</Form>
				<div className={styles['search-handle-box']}>
					<Button htmlType="button" onClick={onReset}>
						重置
					</Button>
					<Button
						onClick={search}
						style={{
							background: '#23955C',
							color: '#fff',
							marginLeft: '10px',
							border: 'none',
							boxShadow: 'none'
						}}
					>
						查询
					</Button>
				</div>
			</div>

			{/* <DataTable ref={tableRef} columns={columns} getData={getData}></DataTable> */}
			{/* <div className={styles['my-table-box']}>
				<Table
					className={styles['my-table']}
					columns={columns}
					dataSource={tableData}
					pagination={false}
				></Table>
				<div className={styles['pagination-box']}>
					<div>
						<span style={{ marginRight: '10px' }}>共{total}条记录</span>
						<span>
							第{current}/{Math.ceil(total / size)}页
						</span>
					</div>
					<Pagination
						current={current}
						total={total}
						showSizeChanger
						onShowSizeChange={onShowSizeChange}
						onChange={onChange}
						showQuickJumper
					/>
				</div>
			</div> */}

			{tableData && tableData.length > 6 ? (
				<div className={styles['my-table-box']}>
					<Table
						className={styles['my-table']}
						columns={columns}
						dataSource={tableData}
						pagination={false}
					></Table>
					<div className={styles['pagination-box']}>
						<div>
							<span style={{ marginRight: '10px' }}>共{total}条记录</span>
							<span>
								第{current}/{Math.ceil(total / size)}页
							</span>
						</div>
						<Pagination
							current={current}
							total={total}
							showSizeChanger
							onShowSizeChange={onShowSizeChange}
							onChange={onChange}
							showQuickJumper
						/>
					</div>
				</div>
			) : (
				<Empty
					image={emptyPage}
					description={
						<div className={styles['empty-tip-box']}>
							<div className={styles['empty-tip1']}>暂无数据</div>
							<div className={styles['empty-tip2']}>数据空空如也~</div>
						</div>
					}
				/>
			)}

			<Show
				open={openShow}
				defaultValue={currentRow}
				cancel={handleCancelShow}
			></Show>
		</div>
	);
};
