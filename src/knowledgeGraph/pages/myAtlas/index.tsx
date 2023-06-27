import React, { useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import emptyPage from '@/assets/img/noGraph.png';
import SvgIcon from '@/components/svg-icon';
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
const { RangePicker } = DatePicker;
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import DeleteDialog from '@/components/delete-dialog';
import styles from './index.module.less';

import { getMyAltasList, deleteGraph } from '@/api/knowLedgeGraph/myAltas';

interface TableProps {
	data: [];
	total: number;
	current: number;
	size: number; //每页数量
	onShowSizeChange: (current: any, size: any) => void;
	onChange: (pageNumber: number) => void;
	refresh: () => void;
}
const MyTableCom = React.memo(
	(props: TableProps) => {
		const [messageApi, contextHolder] = message.useMessage();
		const [curId, setCurId] = React.useState();
		const { data, total, current, size, onShowSizeChange, onChange, refresh } =
			props;
		console.log(data, 424242);
		const [dataSource, setDataSource] = React.useState();
		const navigate = useNavigate();
		// 查看
		const handleDetail = (row: any) => {
			navigate('/altasDetail', { state: { id: row.id } });
		};

		const [openDel, setOpenDel] = React.useState(false);

		// 删除
		const handleDelete = (row: any) => {
			setCurId(row.id);
			setOpenDel(true);
		};

		const handleCancleDel = () => {
			setOpenDel(false);
		};

		const submitDel = () => {
			deleteGraph({ graphId: curId }).then((res) => {
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
				render: (text, record, index) => `${(current - 1) * size + index + 1}`
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
						<div className={styles['operate-box']}>
							<span
								className={styles['operate-item']}
								onClick={() => handleDetail(row)}
							>
								<SvgIcon name="see" color="#23955C"></SvgIcon>
								<span style={{ marginLeft: '2px' }}>查看</span>
							</span>
							<span>
								<Divider type="vertical" />
							</span>
							<span
								className={styles['operate-item']}
								onClick={() => handleDelete(row)}
							>
								<SvgIcon name="delete" color="#23955C"></SvgIcon>
								<span style={{ marginLeft: '2px' }}>删除</span>
							</span>
						</div>
					);
				}
			}
		];

		return (
			<div className={styles['my-table-box']}>
				{contextHolder}
				<Table
					rowKey={(record) => {
						return record.id + Date.now(); //在这里加上一个时间戳就可以了
					}}
					className={styles['my-table']}
					columns={colums}
					dataSource={data}
					pagination={false}
				></Table>
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
				<DeleteDialog
					open={openDel}
					handleCancle={handleCancleDel}
					onOk={submitDel}
				></DeleteDialog>
			</div>
		);
	},
	(prevProps, nextProps) => {
		// console.log(prevProps.data, nextProps.data);
		if (!isEqual(prevProps.data, nextProps.data)) {
			return false;
		}
		return true;
	}
);

const MyAtlasCom = () => {
	const [tableData, setTableData] = React.useState([]);
	const [form] = Form.useForm();
	const [current, setCurrent] = React.useState(1);
	const [size, setSize] = React.useState(10);
	const [total, setTotal] = React.useState(0);
	useEffect(() => {
		getList();
	}, [size, current]);

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
				>
					<Form.Item name="name" label="图谱名称" colon={false}>
						<Input placeholder="请输入" />
					</Form.Item>

					<Form.Item name="gmtCreated" label="创建时间" colon={false}>
						<RangePicker
							format="YYYY-MM-DD"
							separator={<div>至</div>}
							className={styles.searchItem}
						/>
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
