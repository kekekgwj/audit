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
	Empty,
	message
} from 'antd';
import type { PaginationProps } from 'antd';
const { RangePicker } = DatePicker;
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import DeleteDialog from '@graph/components/delete-dialog';
import styles from './index.module.less';

import { getMyAltasList, deleteGraph } from '@/api/knowledgeGraph/myAltas';

interface TableProps {
	data: [];
	total: number;
	current: number;
	size: number; //每页数量
	onShowSizeChange: (current: any, size: any) => void;
	onChange: (pageNumber: Number) => void;
	refresh: () => void;
}
const MyTableCom = React.memo((props: TableProps) => {
	const [messageApi, contextHolder] = message.useMessage();
	const [curId, setCurId] = React.useState();
	const { data, total, current, size, onShowSizeChange, onChange, refresh } =
		props;
	const navigate = useNavigate();
	// 查看
	const handleDetail = (row: any) => {
		navigate('/altasDetail', { state: { id: row.id } });
	};

	const [openDel, setOpenDel] = React.useState(false);

	// 删除
	const handleDelete = (row) => {
		setCurId(row.id);
		setOpenDel(true);
	};

	const handleCancleDel = () => {
		setOpenDel(false);
	};

	const submitDel = () => {
		deleteGraph({ id: curId }).then((res) => {
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
			title: '图谱名称',
			dataIndex: 'name'
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
	const [current, setCurrent] = React.useState(1);
	const [size, setSize] = React.useState(10);
	const [total, setTotal] = React.useState(0);
	useEffect(() => {
		getList();
	}, []);

	const getList = async () => {
		const searchFormData = form.getFieldsValue();
		const searchData = {
			name: searchFormData.name || '',
			beginTime: '',
			endTime: ''
		};
		if (searchFormData.gmtCreated && searchFormData.gmtCreated.length > 0) {
			searchData.beginTime = searchFormData.gmtCreated[0].format('YYYY-MM-DD');
			searchData.endTime = searchFormData.gmtCreated[1].format('YYYY-MM-DD');
		}

		const data = {
			current: current,
			size: size,
			...searchData
		};
		const res = await getMyAltasList(data);
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
					<Form.Item name="name" label="图谱名称">
						<Input />
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
export default MyAtlasCom;
