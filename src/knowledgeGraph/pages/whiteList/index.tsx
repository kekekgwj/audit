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
	Empty
} from 'antd';
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

import { getWhiteList } from '@/api/knowledgeGraph/whiteList';

interface TanbleProps {
	data: [];
}

const MyTableCom = React.memo((props: TanbleProps) => {
	const navigate = useNavigate();
	const [curId, setCurId] = React.useState();
	const [openAdd, setOpenAdd] = React.useState(false);
	const addRef = useRef();
	const [openEdit, setOpenEdit] = React.useState(false);
	const editRef = useRef();
	const [openDel, setOpenDel] = React.useState(false);

	const { data } = props;

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
		console.log('delete:' + curId);
		setOpenDel(false);
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
			dataIndex: 'createTime'
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
					<span style={{ marginRight: '10px' }}>共85条记录</span>
					<span>第1/50页</span>
				</div>
				<Pagination total={85} showSizeChanger showQuickJumper />
			</div>
			<Add open={openAdd} handleCancel={handleCancelAdd} cRef={addRef}></Add>
			<Edit
				open={openEdit}
				handleCancel={handleCancelEdit}
				cRef={editRef}
				id={curId}
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
	// const [showTable, setShowTable] = React.useState(false);
	const [form] = Form.useForm();
	const [tableData, setTableData] = React.useState([]);

	useEffect(() => {
		getList();
	}, []);

	const getList = async () => {
		const res = await getWhiteList();
		setTableData(res);
	};

	const onReset = () => {
		form.resetFields();
	};
	const search = (res) => {
		console.log(res);
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
					<Form.Item name="mainType" label="名称">
						<Input />
					</Form.Item>

					<Form.Item name="type" label="类型">
						<Input />
					</Form.Item>

					<Form.Item name="range-picker" label="创建时间">
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
				<MyTableCom data={tableData} />
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
