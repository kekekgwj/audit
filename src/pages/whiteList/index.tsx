import React, { useEffect } from 'react';
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
const { RangePicker } = DatePicker;
import { EyeOutlined, DeleteOutlined, FormOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import Add from './add';

const MyTableCom = React.memo(() => {
	const navigate = useNavigate();
	const [open, setOpen] = React.useState(false);
	//添加
	const add = () => {
		setOpen(true);
	};

	const handleCancel = () => {
		setOpen(false);
	};
	// 查看
	const handleDetail = (row) => {
		navigate('/altasDetail', { state: { id: row.id } });
	};

	//编辑
	const handleEdit = (row) => {
		console.log(row);
	};

	// 删除
	const handleDelete = () => {};

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
							onClick={() => handleDetail(row)}
							style={{ cursor: 'pointer', marginRight: '10px' }}
						>
							<Space>
								<EyeOutlined style={{ color: '#23955C' }} />
							</Space>
							<span style={{ marginLeft: '2px' }}>查看</span>
						</span>
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
							onClick={() => handleDelete(row, record.key)}
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
	const data = [
		{
			key: '1',
			name: '图谱一',
			type: '关联关系图普',
			createTime: '2023-04-021'
		},
		{
			key: '2',
			name: '图谱二',
			type: '关联关系图普',
			createTime: '2023-04-021'
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
			<Add open={open} handleCancel={handleCancel}></Add>
		</div>
	);
});

const WhiteListCom = () => {
	// 是否显示表
	const [showTable, setShowTable] = React.useState(false);
	const [form] = Form.useForm();

	const onReset = () => {
		form.resetFields();
		setShowTable(false);
	};
	const search = (res) => {
		console.log(res);
		setShowTable(true);
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
			{showTable ? <MyTableCom /> : <Empty />}
		</div>
	);
};
export default WhiteListCom;
