import { useRef, useState, useEffect } from 'react';
// import DataTable from '@/components/data-table';
import Delete from '@/components/delete-dialog';
import Edit from './components/edit';
import Show from './components/show';
import Add from './components/add';
import emptyPage from '@/assets/img/empty-data.png';

import styles from './index.module.less';
import {
	Button,
	DatePicker,
	Divider,
	Form,
	Input,
	message,
	Table,
	Pagination,
	Empty,
	Row,
	Col
} from 'antd';
import type { PaginationProps } from 'antd';
import SvgIcon from '@/components/svg-icon';

import {
	getSqlPage,
	saveSql,
	deleteSql,
	updateSql
} from '@/api/dataAnalysis/sql';

const { RangePicker } = DatePicker;

interface DataType {
	key: string;
	sqlName: string;
	gmtCreated?: string;
	sqlContent?: string;
	gmtModified?: string;
}

export default () => {
	const tableRef = useRef();
	const [messageApi, contextHolder] = message.useMessage();
	const [searchForm] = Form.useForm();

	const [currentRow, setCurrentRow] = useState<DataType>();
	const [openDel, setOpenDel] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openShow, setOpenShow] = useState(false);
	const [openAdd, setOpenAdd] = useState(false);
	// 表数据
	const [tableData, setTableData] = useState([]);
	const [current, setCurrent] = useState(1);
	const [size, setSize] = useState(10);
	const [total, setTotal] = useState(0);
	const columns = [
		{
			title: '序号',
			width: 100,
			render: (text, record, index) => `${(current - 1) * size + index + 1}`
		},
		{
			title: 'SQL名称',
			dataIndex: 'sqlName'
		},
		{
			title: '创建时间',
			width: 200,
			dataIndex: 'gmtModified'
		},
		{
			title: '操作',
			key: 'operaion',
			width: 300,
			render: (row, record) => {
				return (
					<div className={styles['operate-box']}>
						<span
							className={styles['operate-item']}
							onClick={() => {
								handleEdit(row);
							}}
						>
							<SvgIcon name="edit" color="#24A36F"></SvgIcon>
							<span style={{ marginLeft: '2px' }}>编辑</span>
						</span>
						<span>
							<Divider type="vertical" />
						</span>
						<span
							className={styles['operate-item']}
							onClick={() => {
								handleShow(row);
							}}
						>
							<SvgIcon name="see" color="#23955C"></SvgIcon>
							<span style={{ marginLeft: '2px' }}>查看</span>
						</span>
						<span>
							<Divider type="vertical" />
						</span>
						<span
							className={styles['operate-item']}
							onClick={() => {
								handleDelete(row);
							}}
						>
							<SvgIcon name="delete" color="#24A36F"></SvgIcon>
							<span style={{ marginLeft: '2px' }}>删除</span>
						</span>
					</div>
				);
			}
		}
	];

	useEffect(() => {
		getData();
	}, [current, size]);

	// 打开新增弹框
	const handleAdd = () => {
		setOpenAdd(true);
	};
	// 提交新增
	const handleSubmitAdd = async (form: DataType) => {
		await saveSql({
			sql: form.sqlContent || '',
			sqlName: form.sqlName
		});

		messageApi.open({
			type: 'success',
			content: '新增成功'
		});

		setOpenAdd(false);
		getData();
	};

	// 取消编辑
	const handleCancelAdd = () => {
		setOpenAdd(false);
	};

	// 打开查看弹框
	const handleShow = (row: DataType) => {
		setCurrentRow(row);
		setOpenShow(true);
	};

	// 关闭查看弹框
	const handleCancelShow = () => {
		setOpenShow(false);
	};

	// 打开编辑弹框
	const handleEdit = (row: DataType) => {
		setCurrentRow(row);
		setOpenEdit(true);
	};

	// 提交编辑
	const handleSubmitEdit = async (form: DataType) => {
		await updateSql({
			sql: form.sqlContent || '',
			sqlId: form.key,
			sqlName: form.sqlName
		});

		messageApi.open({
			type: 'success',
			content: '编辑成功'
		});

		setOpenEdit(false);
		getData();
	};

	// 取消编辑
	const handleCancelEdit = () => {
		setOpenEdit(false);
	};

	// 打开删除二次确认框
	const handleDelete = (row: DataType) => {
		setCurrentRow(row);
		setOpenDel(true);
	};

	// 取消删除
	const handleCancleDel = () => {
		setOpenDel(false);
	};

	// 确认删除
	const submitDel = async () => {
		await deleteSql(currentRow.key);

		messageApi.open({
			type: 'success',
			content: '删除成功'
		});
		setOpenDel(false);
		// tableRefresh();
		getData();
	};

	const getData = async () => {
		const query = searchForm.getFieldsValue();

		const res = await getSqlPage({
			current: current,
			size: size,
			name: query.sqlName || '',
			startTime: query.createdDate
				? query.createdDate[0].format('YYYY-MM-DD')
				: '',
			endTime: query.createdDate
				? query.createdDate[1].format('YYYY-MM-DD')
				: ''
		});

		const list: DataType[] = res.records.map((item) => ({
			key: item.id,
			sqlName: item.name,
			gmtModified: item.gmtModified
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
		<div className={styles.page} style={{ padding: '20px' }}>
			<div className={styles.searchForm}>
				<Form
					form={searchForm}
					labelCol={{ span: 6 }}
					wrapperCol={{ span: 18 }}
					layout="inline"
					style={{ width: 'calc(100% - 138px)' }}
				>
					<Row style={{ width: '100%' }}>
						<Col span={8}>
							<Form.Item
								name="sqlName"
								label="SQL名称"
								labelCol={{ span: 6 }}
								wrapperCol={{ span: 18 }}
								colon={false}
							>
								<Input placeholder="请输入" />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name="createdDate" label="创建时间" colon={false}>
								<RangePicker format="YYYY-MM-DD" separator={<div>至</div>} />
							</Form.Item>
						</Col>
					</Row>
				</Form>
				<div className={styles['search-handle-box']}>
					<Button htmlType="button" onClick={onReset}>
						重置
					</Button>
					<Button
						type="primary"
						style={{
							marginLeft: '10px'
						}}
						onClick={search}
					>
						查询
					</Button>
				</div>
			</div>

			<Button
				type="primary"
				style={{ marginBottom: '20px' }}
				onClick={handleAdd}
			>
				新增SQL
			</Button>

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
			{tableData && tableData.length ? (
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
				<Empty image={emptyPage} description={false} />
			)}
			{contextHolder}

			<Delete
				open={openDel}
				handleCancle={handleCancleDel}
				onOk={submitDel}
			></Delete>

			<Add
				open={openAdd}
				defaultValue={{
					sqlName: '',
					sqlContent: '',
					useTo: ''
				}}
				submit={handleSubmitAdd}
				cancel={handleCancelAdd}
			></Add>

			<Edit
				open={openEdit}
				defaultValue={currentRow}
				submit={handleSubmitEdit}
				cancel={handleCancelEdit}
			></Edit>

			<Show
				open={openShow}
				defaultValue={currentRow}
				cancel={handleCancelShow}
			></Show>
		</div>
	);
};
