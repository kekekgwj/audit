import React, { useEffect, useRef } from 'react';
import {
	Table,
	Space,
	Pagination,
	Form,
	Input,
	Button,
	Modal,
	Select,
	DatePicker,
	Empty,
	message
} from 'antd';
import type { PaginationProps } from 'antd';
import emptyPage from '@/assets/img/empty.png';
const { RangePicker } = DatePicker;
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import Delete from '@graph/components/delete-dialog';
import ImportDialog from './components/importData';
import { getDataList, deleteData } from '@/api/dataAnalysis/dataManage.ts';

import {
	getWhiteList,
	getWhiteListType,
	deleteWhiteList
} from '@/api/knowledgeGraph/whiteList';

interface TanbleProps {
	data: [];
	listType: [];
	total: number;
	current: number;
	size: number; //每页数量
	onShowSizeChange: (current: any, size: any) => void;
	onChange: (pageNumber: Number) => void;
	refresh: () => void;
}

const MyTableCom = React.memo((props: TanbleProps) => {
	const [messageApi, contextHolder] = message.useMessage();
	const [curId, setCurId] = React.useState();

	const [openEdit, setOpenEdit] = React.useState(false);
	const editRef = useRef();
	const [openDel, setOpenDel] = React.useState(false);
	const { data, total, current, size, onShowSizeChange, onChange, refresh } =
		props;

	//编辑
	const handleEdit = (row) => {
		setCurId(row.id);
		console.log(row.id, 595959);
		setOpenEdit(true);
	};

	const handleCancelEdit = () => {
		editRef.current.resetForm();
		setOpenEdit(false);
	};

	// 删除
	const handleDelete = (row) => {
		setCurId(row.id);
		setOpenDel(true);
	};

	const handleCancleDel = () => {
		setOpenDel(false);
	};

	const submitDel = () => {
		deleteData({ tableId: curId }).then((res) => {
			setOpenDel(false);
			messageApi.open({
				type: 'success',
				content: '删除成功'
			});
			refresh();
		});
	};

	const colums = [
		{
			title: '序号',
			dataIndex: 'key'
		},
		{
			title: '数据表名称',
			dataIndex: 'tableName'
		},

		{
			title: '创建时间',
			dataIndex: 'gmtCreated'
		},
		{
			title: '更新时间',
			dataIndex: 'gmtCreated'
		},
		{
			title: '操作',
			key: 'operaion',
			render: (row, record) => {
				return (
					<div>
						<span
							onClick={() => handleEdit(row)}
							style={{ cursor: 'pointer', marginRight: '10px' }}
						>
							<Space>
								<EyeOutlined style={{ color: '#23955C' }} />
							</Space>
							<span style={{ marginLeft: '2px' }}>查看</span>
						</span>
						<span
							onClick={() => handleDelete(row)}
							style={{ cursor: 'pointer' }}
						>
							<Space>
								<DeleteOutlined style={{ color: '#23955C' }} />
							</Space>
							<span style={{ marginLeft: '2px' }}>删除</span>
						</span>
					</div>
				);
			}
		}
	];

	return (
		<div>
			<Table
				columns={colums}
				dataSource={data}
				pagination={{ position: ['none'] }}
			></Table>
			<div
				style={{
					textAlign: 'center',
					marginTop: '20px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between'
				}}
			>
				<div>
					<span style={{ marginRight: '10px' }}>共{total}条记录</span>
					<span>
						第{current}/{Math.ceil(total / size)}页
					</span>
				</div>
				<Pagination
					total={total}
					showSizeChanger
					onShowSizeChange={onShowSizeChange}
					onChange={onChange}
					showQuickJumper
				/>
			</div>
			<Delete
				open={openDel}
				handleCancle={handleCancleDel}
				onOk={submitDel}
			></Delete>
		</div>
	);
});

const DataManageCom = () => {
	// 是否显示表
	const [form] = Form.useForm();
	const [tableData, setTableData] = React.useState([]);
	const [current, setCurrent] = React.useState(1);
	const [size, setSize] = React.useState(10);
	const [total, setTotal] = React.useState(0);
	const [openImport, setOpenImport] = React.useState(false);
	const importRef = useRef();

	useEffect(() => {
		getList();
	}, [current, size]);

	useEffect(() => {}, []);

	const getList = async () => {
		const searchFormData = form.getFieldsValue();
		const searchData = {
			tableName: searchFormData.tableName || '',
			beginTime: '',
			endTime: ''
		};
		if (searchFormData.gmtCreated && searchFormData.gmtCreated.length > 0) {
			searchData.beginTime = searchFormData.gmtCreated[0].format('YYYY-MM-DD');
			searchData.endTime = searchFormData.gmtCreated[1].format('YYYY-MM-DD');
		}
		console.log(searchData, 246246);
		const data = {
			current: current,
			size: size,
			...searchData
		};
		const res = await getDataList(data);
		console.log(res, 209999);
		setTableData(res.records);
		setTotal(res.total);
	};

	//导入数据
	const importData = () => {
		setOpenImport(true);
	};
	//取消导入
	const handleCancel = () => {
		importRef.current.resetForm();
		setOpenImport(false);
	};
	//重置
	const onReset = () => {
		form.resetFields();
		getList();
	};
	//查询
	const search = () => {
		setCurrent(1);
		getList();
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

	return (
		<div style={{ padding: '20px' }}>
			<div className={styles.searchForm}>
				<Form
					form={form}
					labelCol={{ span: 6 }}
					wrapperCol={{ span: 18 }}
					layout="inline"
					onFinish={(res: any) => {
						search();
					}}
				>
					<Form.Item name="tableName" label="表名称">
						<Input />
					</Form.Item>

					<Form.Item name="gmtCreated" label="创建时间">
						<RangePicker format="YYYY-MM-DD" />
					</Form.Item>

					<Form.Item name="updateTime" label="更新时间">
						<RangePicker format="YYYY-MM-DD" />
					</Form.Item>

					<Form.Item>
						<Button htmlType="button" onClick={onReset}>
							重置
						</Button>
					</Form.Item>
					<Form.Item>
						<Button
							htmlType="submit"
							style={{ background: '#23955C', color: '#fff' }}
						>
							查询
						</Button>
					</Form.Item>
				</Form>
			</div>
			<div className={styles['handle-table-box']}>
				<Button
					htmlType="button"
					onClick={() => {
						importData();
					}}
					className={styles['add-button']}
				>
					数据导入
				</Button>
			</div>
			{tableData?.length > 0 ? (
				<MyTableCom
					data={tableData}
					onShowSizeChange={onShowSizeChange}
					onChange={onChange}
					total={total}
					size={size}
					current={current}
					refresh={getList}
				/>
			) : (
				<Empty
					image={emptyPage}
					description={false}
					imageStyle={{ height: '193px' }}
				/>
			)}
			<ImportDialog
				open={openImport}
				cRef={importRef}
				handleCancel={handleCancel}
				refresh={getList}
			></ImportDialog>
		</div>
	);
};
export default DataManageCom;
