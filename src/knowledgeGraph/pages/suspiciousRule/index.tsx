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
import CustomDialog from '@graph/components/custom-dialog';
import { getSuspiciousRule } from '@/api/knowledgeGraph/suspiciousRule';

// 使用弹框
interface Props {
	open: boolean;
	onCancel: () => void;
	curRow: {};
}

interface ProjectIdOption {
	label: string;
	value: string | number;
}

const UseModal = React.memo((prop: Props) => {
	const { open, onCancel, curRow } = prop;
	const [form] = Form.useForm();

	const [projectOptions, setProjectOptions] = React.useState(
		Array<ProjectIdOption>
	);

	useEffect(() => {
		getProjectIdOptions();
		initForm();
	}, [open]);

	const initForm = () => {
		form.setFieldValue('projects', [
			{
				projectId: undefined,
				projectMember: undefined
			}
		]);
	};

	const getProjectIdOptions = async () => {
		setProjectOptions([
			{ value: '001', label: 'ID1' },
			{ value: '002', label: 'ID2' },
			{ value: '003', label: 'ID3' }
		]);
	};

	// 提交表单
	const onSubmit = () => {
		const data = form.getFieldsValue();
		console.log(data, 677777);
		onCancel();
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
				<Form.List name="projects">
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name, ...restField }) => (
								<div key={key}>
									<Form.Item
										label="项目ID"
										{...restField}
										name={[name, 'projectId']}
									>
										<Select
											placeholder="请选择"
											allowClear
											options={projectOptions}
										></Select>
									</Form.Item>
									<Form.Item
										label="项目成员"
										{...restField}
										name={[name, 'projectMember']}
									>
										<Input placeholder="请输入" />
									</Form.Item>
								</div>
							))}
							<Space
								style={{
									textAlign: 'right',
									justifyContent: 'right',
									width: '100%'
								}}
							>
								{fields.length > 1 ? (
									<span
										style={{ marginRight: '5px', cursor: 'pointer' }}
										onClick={() => {
											remove(fields[fields.length - 1].name);
										}}
									>
										<MinusCircleOutlined
											style={{ fontSize: '14px', color: '#FF8683' }}
										/>
										<span
											style={{
												fontSize: '14px',
												color: '#FF8683',
												marginLeft: '4px'
											}}
										>
											删除
										</span>
									</span>
								) : (
									<></>
								)}
								<span onClick={() => add()} style={{ cursor: 'pointer' }}>
									<PlusCircleOutlined
										style={{ fontSize: '14px', color: '#23955C' }}
									/>
									<span
										style={{
											fontSize: '14px',
											color: '#23955C',
											marginLeft: '4px',
											cursor: 'pointer'
										}}
									>
										添加
									</span>
								</span>
							</Space>
						</>
					)}
				</Form.List>
			</Form>
		</CustomDialog>
	);
});

interface TableProps {
	data: [];
	total: number;
	current: number;
	size: number; //每页数量
	onShowSizeChange: (current: any, size: any) => void;
	onChange: (pageNumber: Number) => void;
}
const MyTableCom = React.memo((props: TableProps) => {
	//使用弹框
	const [open, setOpen] = React.useState(false);
	const [curRow, setCurRow] = React.useState({});
	const handleUse = (row, key) => {
		console.log(row);
		setOpen(true);
		setCurRow(row);
	};
	const { data, total, current, size, onShowSizeChange, onChange } = props;
	const colums = [
		{
			title: '序号',
			dataIndex: 'key'
		},
		{
			title: '规则名称',
			dataIndex: 'name'
		},
		{
			title: '规则用途',
			dataIndex: 'description'
		},
		{
			title: '操作',
			key: 'operaion',
			render: (row, record) => {
				return (
					<span
						onClick={() => handleUse(row, record.key)}
						style={{ cursor: 'pointer' }}
					>
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
		<div>
			<div>
				<Table
					columns={colums}
					dataSource={data}
					pagination={{ position: ['none'] }}
				></Table>
			</div>
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
	};

	const searchRule = (res) => {
		console.log(res);
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
						searchRule(res);
					}}
				>
					<Form.Item name="name" label="规则名称">
						<Input />
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
