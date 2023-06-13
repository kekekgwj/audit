import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
	message,
	Divider
} from 'antd';
import type { PaginationProps } from 'antd';
import emptyPage from '@/assets/img/empty.png';
const { RangePicker } = DatePicker;
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import SvgIcon from '@/components/svg-icon';
import styles from './index.module.less';
import Delete from '@/components/delete-dialog';
import ImportDialog from './components/importData';
import { getDataList, deleteData } from '@/api/dataAnalysis/dataManage.ts';

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
	const navigate = useNavigate();
	const [messageApi, contextHolder] = message.useMessage();
	const [curId, setCurId] = React.useState();
	const editRef = useRef();
	const [openDel, setOpenDel] = React.useState(false);
	const { data, total, current, size, onShowSizeChange, onChange, refresh } =
		props;

	//查看
	const handleDetail = (row: any) => {
		// 跳转到详情页
		console.log(row.id, 595959);
		navigate('/sql/dataDetail', { state: { id: row.id } });
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
			render: (text, record, index) => `${(current - 1) * size + index + 1}`
		},
		{
			title: '数据表名称',
			dataIndex: 'tableCnName'
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
							<SvgIcon name="delete" color="#24A36F"></SvgIcon>
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
			createdBeginTime: '',
			createdEndTime: '',
			modifiedBeginTime: '',
			modifiedEndTime: ''
		};
		if (searchFormData.gmtCreated && searchFormData.gmtCreated.length > 0) {
			searchData.createdBeginTime =
				searchFormData.gmtCreated[0].format('YYYY-MM-DD');
			searchData.createdEndTime =
				searchFormData.gmtCreated[1].format('YYYY-MM-DD');
		}
		if (searchFormData.updateTime && searchFormData.updateTime.length > 0) {
			searchData.modifiedBeginTime =
				searchFormData.updateTime[0].format('YYYY-MM-DD');
			searchData.modifiedEndTime =
				searchFormData.updateTime[1].format('YYYY-MM-DD');
		}

		const data = {
			current: current,
			size: size,
			...searchData
		};
		const res = await getDataList(data);
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
		<div className={styles['data-manage-page']}>
			<div className={styles.searchForm}>
				<Form
					form={form}
					layout="inline"
					onFinish={(res: any) => {
						search();
					}}
				>
					<Form.Item name="tableName" label="表名称">
						<Input placeholder="请输入" />
					</Form.Item>

					<Form.Item name="gmtCreated" label="创建时间">
						<RangePicker format="YYYY-MM-DD" separator={<div>至</div>} />
					</Form.Item>

					<Form.Item name="updateTime" label="更新时间">
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
				setOpenImport={setOpenImport}
			></ImportDialog>
		</div>
	);
};
export default DataManageCom;
