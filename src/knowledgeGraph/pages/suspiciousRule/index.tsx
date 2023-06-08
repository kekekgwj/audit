import React, { useEffect } from 'react';
import {
	Table,
	Space,
	Pagination,
	Form,
	Input,
	Button,
	Select,
	Empty
} from 'antd';
import {
	PlayCircleOutlined,
	MinusCircleOutlined,
	PlusCircleOutlined
} from '@ant-design/icons';
import emptyPage from '@/assets/img/empty.png';
import styles from './index.module.less';
import CustomDialog from '@/components/custom-dialog';
import { getSuspiciousRule } from '@/api/knowledgeGraph/rule';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

// 使用弹框
interface Props {
	open: boolean;
	onCancel: () => void;
	curRow: {
		name: string;
		id: string;
	};
}

interface ProjectIdOption {
	label: string;
	value: string | number;
}

const UseModal = React.memo((prop: Props) => {
	const { open, onCancel, curRow } = prop;
	const [form] = Form.useForm();
	const navigate = useNavigate();

	// 提交表单
	const onSubmit = () => {
		const data = form.getFieldsValue();
		console.log(data, 677777);

		// onCancel();
		// 跳转到查询结果界面
		navigate('/ruleResult', {
			state: { value: data.value, name: curRow.name, ruleId: curRow.id }
		});
	};

	return (
		<CustomDialog
			open={open}
			title="使用规则"
			width={600}
			onOk={onSubmit}
			onCancel={onCancel}
		>
			<Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
				<Form.Item label={curRow.nodeLabel} name="value">
					<Input />
				</Form.Item>
			</Form>
		</CustomDialog>
	);
});

interface TableProps {
	data: [];
	total: number;
	current: number;
	size: number; //每页数量
	onShowSizeChange: (current: number, size: number) => void;
	onChange: (pageNumber: number) => void;
}
const MyTableCom = React.memo((props: TableProps) => {
	//使用弹框
	const [open, setOpen] = React.useState(false);
	const [curRow, setCurRow] = React.useState({});
	const handleUse = (row: any) => {
		setOpen(true);
		setCurRow(row);
	};
	const { data, total, current, size, onShowSizeChange, onChange } = props;
	const colums = [
		{
			title: '序号',
			render: (text, record, index) => `${index + 1}`,
			width: 100
		},
		{
			title: '规则名称',
			dataIndex: 'name',
			ellipsis: true,
			width: 200,
			sorter: (a: any, b: any) => a.name.localeCompare(b.name)
		},
		{
			title: '规则内容',
			dataIndex: 'content',
			ellipsis: true,
			sorter: (a: any, b: any) => a.content.localeCompare(b.content)
		},
		{
			title: '操作',
			width: 150,
			key: 'operaion',
			render: (row, record) => {
				return (
					<span onClick={() => handleUse(row)} style={{ cursor: 'pointer' }}>
						<Space>
							<PlayCircleOutlined style={{ color: '#23955C' }} />
						</Space>
						<span style={{ marginLeft: '2px' }}>使用</span>
					</span>
				);
			}
		}
	];
	return (
		<div className={styles['my-table-box']}>
			<div>
				<Table
					className={styles['my-table']}
					columns={colums}
					dataSource={data}
					pagination={false}
				></Table>
			</div>
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
			<UseModal
				open={open}
				curRow={curRow}
				onCancel={() => {
					setOpen(false);
				}}
			></UseModal>
		</div>
	);
});

const RuleCom = () => {
	const [data, setData] = React.useState();
	const [form] = Form.useForm();
	const [current, setCurrent] = React.useState(1);
	const [size, setSize] = React.useState(10);
	const [total, setTotal] = React.useState(0);
	//当前选中数据
	useEffect(() => {
		getList();
	}, []);

	const getList = async () => {
		const searchFormData = form.getFieldsValue();
		const data = {
			name: searchFormData.name || '',
			current: current,
			size: size
		};
		const res = await getSuspiciousRule(data);
		console.log(res, 253253);
		setData(res.records);
		setTotal(res.total);
	};

	const onReset = () => {
		form.resetFields();
		getList();
	};

	const search = () => {
		// console.log(res);
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
					<Form.Item name="name" label="规则名称" colon={false}>
						<Input placeholder="请输入" className={styles.searchItem} />
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

			{data?.length > 0 ? (
				<MyTableCom
					data={data}
					onShowSizeChange={onShowSizeChange}
					onChange={onChange}
					total={total}
					size={size}
					current={current}
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

export default RuleCom;
