import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
	Table,
	Space,
	Pagination,
	Form,
	Input,
	Button,
	Modal,
	Select,
	ConfigProvider,
	DatePicker,
	Empty,
	message
} from 'antd';
import type { PaginationProps } from 'antd';
import emptyPage from '@/assets/img/empty.png';
const { RangePicker } = DatePicker;
const { confirm } = Modal;

import {
	EyeOutlined,
	DeleteOutlined,
	FormOutlined,
	ExclamationCircleFilled
} from '@ant-design/icons';
import styles from './index.module.less';
import Add from './components/add';
import Edit from './components/edit';
import Delete from '@graph/components/delete-dialog';

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
	const [openAdd, setOpenAdd] = React.useState(false);
	const addRef = useRef();
	const [openEdit, setOpenEdit] = React.useState(false);
	const editRef = useRef();
	const [openDel, setOpenDel] = React.useState(false);
	const {
		data,
		total,
		current,
		size,
		onShowSizeChange,
		onChange,
		listType,
		refresh
	} = props;

	//添加
	const add = () => {
		setOpenAdd(true);
	};

	const handleCancelAdd = () => {
		addRef.current.resetForm();
		setOpenAdd(false);
	};

	//编辑
	const handleEdit = (row) => {
		setCurId(row.id);
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
		deleteWhiteList({ id: curId }).then((res) => {
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
			title: '名称',
			dataIndex: 'name'
		},
		{
			title: '类型',
			dataIndex: 'type'
		},
		{
			title: '创建时间',
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
								<FormOutlined style={{ color: '#23955C' }} />
							</Space>
							<span style={{ marginLeft: '2px' }}>编辑</span>
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
			<div className={styles['handle-table-box']}>
				<Button
					htmlType="button"
					onClick={() => {
						add();
					}}
					className={styles['add-button']}
				>
					新增
				</Button>
			</div>
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
			<Add
				open={openAdd}
				handleCancel={handleCancelAdd}
				cRef={addRef}
				listType={listType}
				refresh={refresh}
			></Add>
			<Edit
				open={openEdit}
				handleCancel={handleCancelEdit}
				cRef={editRef}
				id={curId}
				listType={listType}
				refresh={refresh}
			></Edit>
			<Delete
				open={openDel}
				handleCancle={handleCancleDel}
				onOk={submitDel}
			></Delete>
		</div>
	);
});

const WhiteListCom = () => {
	// 是否显示表
	const [form] = Form.useForm();
	const [tableData, setTableData] = React.useState([]);
	const [current, setCurrent] = React.useState(1);
	const [size, setSize] = React.useState(10);
	const [total, setTotal] = React.useState(0);
	const [listType, setListType] = React.useState([]);

	useEffect(() => {
		getList();
	}, [current, size]);

	useEffect(() => {
		getWhiteListType().then((res) => {
			const options = [];
			res?.forEach((item: any) => {
				options.push({ label: item, value: item });
			});
			setListType(options);
		});
	}, []);

	const getList = async () => {
		const searchFormData = form.getFieldsValue();
		const searchData = {
			name: searchFormData.name || '',
			type: searchFormData.type || '',
			startTime: '',
			endTime: ''
		};
		if (searchFormData.gmtCreated && searchFormData.gmtCreated.length > 0) {
			searchData.startTime = searchFormData.gmtCreated[0].format('YYYY-MM-DD');
			searchData.endTime = searchFormData.gmtCreated[1].format('YYYY-MM-DD');
		}
		console.log(searchData, 246246);
		const data = {
			current: current,
			size: size,
			...searchData
		};
		const res = await getWhiteList(data);
		setTableData(res.records);
		setTotal(res.total);
	};

	const onReset = () => {
		form.resetFields();
		getList();
	};
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
		<div>
			<div className={styles.searchForm}>
				<Form
					form={form}
					labelCol={{ span: 6 }}
					wrapperCol={{ span: 18 }}
					layout="inline"
					onFinish={(res: any) => {
						search(res);
					}}
				>
					<Form.Item name="name" label="名称">
						<Input />
					</Form.Item>

					<Form.Item name="type" label="类型">
						<Select options={listType} style={{ width: 170 }} allowClear />
					</Form.Item>

					<Form.Item name="gmtCreated" label="创建时间">
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
			{tableData?.length > 0 ? (
				<MyTableCom
					data={tableData}
					onShowSizeChange={onShowSizeChange}
					onChange={onChange}
					total={total}
					size={size}
					current={current}
					listType={listType}
					refresh={getList}
				/>
			) : (
				<Empty
					image={emptyPage}
					description={false}
					imageStyle={{ height: '193px' }}
				/>
			)}
		</div>
	);
};
export default WhiteListCom;
