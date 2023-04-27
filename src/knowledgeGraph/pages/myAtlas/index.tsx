import React, { useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import emptyPage from '@/assets/img/empty.png';
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
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import DeleteDialog from '@graph/components/delete-dialog';
import styles from './index.module.less';

import { getMyAltasList } from '@/api/knowledgeGraph/myAltas';

interface TableProps {
	data: [];
}
const MyTableCom = React.memo((props: TableProps) => {
	const { data } = props;
	const navigate = useNavigate();
	// 查看
	const handleDetail = (row) => {
		navigate('/altasDetail', { state: { id: row.id } });
	};

	const [openDel, setOpenDel] = React.useState(false);

	// 删除
	const handleDelete = (row) => {
		setOpenDel(true);
	};

	const handleCancleDel = () => {
		setOpenDel(false);
	};

	const submitDel = () => {
		console.log('delete');
		setOpenDel(false);
	};

	const colums = [
		{
			title: '序号',
			dataIndex: 'key'
		},
		{
			title: '图谱名称',
			dataIndex: 'name'
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
					<span style={{ marginRight: '10px' }}>共85条记录</span>
					<span>第1/50页</span>
				</div>
				<Pagination total={85} showSizeChanger showQuickJumper />
			</div>
			<DeleteDialog
				open={openDel}
				handleCancle={handleCancleDel}
				onOk={submitDel}
			></DeleteDialog>
		</div>
	);
});

const MyAtlasCom = () => {
	const [tableData, setTableData] = React.useState([]);
	const [form] = Form.useForm();
	useEffect(() => {
		getList();
	}, []);

	const getList = async () => {
		const res = await getMyAltasList();
		setTableData(res);
	};

	const onReset = () => {
		form.resetFields();
	};
	const search = (res) => {
		console.log(res);
	};

	return (
		<div className={styles.altasContent}>
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
					<Form.Item name="mainType" label="图谱名称">
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
export default MyAtlasCom;
