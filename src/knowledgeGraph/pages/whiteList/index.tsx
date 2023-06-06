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
	message,
	Divider
} from 'antd';
import type { PaginationProps } from 'antd';
import SvgIcon from '@/components/svg-icon';
import emptyPage from '@/assets/img/noWhiteData.png';
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
import Delete from '@/components/delete-dialog';

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
	onChange: (pageNumber: number) => void;
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

	const showName = (name: string) => {
		const arr = name.split(';');
		const r = arr.filter((s) => {
			return s && s.trim();
		});
		const result = r[0] ? r[0] : '';
		return result;
	};

	const colums = [
		{
			title: '序号',
			render: (text, record, index) => `${(current - 1) * size + index + 1}`
		},
		{
			title: '类型',
			dataIndex: 'type',
			sorter: (a: any, b: any) => a.type.localeCompare(b.type)
		},
		{
			title: '名称',
			dataIndex: 'name',
			render: (name: string) => showName(name),
			sorter: (a: any, b: any) => a.name.localeCompare(b.name)
		},
		{
			title: '创建时间',
			dataIndex: 'gmtModified',
			sorter: (a: any, b: any) => {
				let aTimeString = a.gmtModified;
				let bTimeString = b.gmtModified;
				aTimeString = aTimeString.replace(/-/g, '/');
				bTimeString = bTimeString.replace(/-/g, '/');
				let aTime = new Date(aTimeString).getTime();
				let bTime = new Date(bTimeString).getTime();
				return bTime - aTime;
			}
		},
		{
			title: '操作',
			key: 'operaion',
			render: (row, record) => {
				return (
					<div className={styles['operate-box']}>
						<span
							className={styles['operate-item']}
							onClick={() => handleEdit(row)}
						>
							<SvgIcon name="edit" color="#24A36F"></SvgIcon>
							<span style={{ marginLeft: '2px' }}>编辑</span>
						</span>
						<span>
							<Divider type="vertical" />
						</span>
						<span
							className={styles['operate-item']}
							onClick={() => handleDelete(row)}
						>
							<SvgIcon name="delete" color="#24A36F"></SvgIcon>
							<span style={{ marginLeft: '2px' }}>删除</span>
						</span>
					</div>
				);
			}
		}
	];

	const customizeRenderEmpty = () => (
		//这里面就是我们自己定义的空状态
		<div style={{ textAlign: 'center', marginTop: '100px' }}>
			<img src={emptyPage} alt="" />
		</div>
	);

	return (
		<div className={styles['my-table-box']}>
			{contextHolder}
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
			<ConfigProvider renderEmpty={customizeRenderEmpty}>
				<Table
					className={styles['my-table']}
					columns={colums}
					dataSource={data}
					pagination={false}
				></Table>
			</ConfigProvider>
			{/* <Table
				className={styles['my-table']}
				columns={colums}
				dataSource={data}
				pagination={false}
			></Table> */}
			{data.length ? (
				<div
					style={{
						textAlign: 'center',
						marginTop: '20px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						fontSize: '14px'
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
			) : null}
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
		<div style={{ padding: '20px' }}>
			<div className={styles.searchForm}>
				<Form
					form={form}
					labelCol={{ span: 6 }}
					wrapperCol={{ span: 18 }}
					layout="inline"
				>
					<Form.Item
						name="name"
						label="名称"
						labelCol={{ span: 4 }}
						wrapperCol={{ span: 20 }}
						colon={false}
					>
						<Input placeholder="请输入" />
					</Form.Item>

					<Form.Item name="type" label="类型" colon={false}>
						<Select
							options={listType}
							style={{ width: 170 }}
							allowClear
							placeholder="请选择"
						/>
					</Form.Item>

					<Form.Item name="gmtCreated" label="创建时间" colon={false}>
						<RangePicker format="YYYY-MM-DD" separator={<div>至</div>} />
					</Form.Item>
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
			{/* {tableData?.length > 0 ? (
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
			)} */}
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
		</div>
	);
};
export default WhiteListCom;
