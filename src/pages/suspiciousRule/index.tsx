import React, { useEffect } from 'react';
import {
	Table,
	Space,
	Pagination,
	Form,
	Input,
	Button,
	Modal,
	Select
} from 'antd';
import {
	PlayCircleOutlined,
	MinusCircleOutlined,
	PlusCircleOutlined
} from '@ant-design/icons';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import './rule.less';

// 使用弹框
interface Props {
	open: boolean;
	onCreate: (values: Values) => void;
	onCancel: () => void;
	curRow: {};
}

const UseModal = React.memo((prop: Props) => {
	const { open, onCreate, onCancel, curRow } = prop;
	const [form] = Form.useForm();
	const selfCancel = () => {
		form.resetFields();
		onCancel();
	};
	return (
		<Modal
			className="centerModal"
			open={open}
			title={<div style={{ textAlign: 'center' }}>使用规则</div>}
			okText="确定"
			cancelText="取消"
			onCancel={() => {
				selfCancel();
			}}
			onOk={() => {
				form
					.validateFields()
					.then((values) => {
						form.resetFields();
						onCreate(values);
					})
					.catch((info) => {
						console.log('Validate Failed:', info);
					});
			}}
		>
			<Form
				form={form}
				layout="vertical"
				name="form_in_modal"
				initialValues={{ modifier: 'public' }}
			>
				<Form.Item
					name="id"
					label="项目ID"
					rules={[{ required: true, message: '请选择' }]}
				>
					<Select placeholder="请选择" allowClear>
						<Select.Option value="male">male</Select.Option>
						<Select.Option value="female">female</Select.Option>
						<Select.Option value="other">other</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item name="member" label="项目成员">
					<Input />
				</Form.Item>

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
										<Select placeholder="请选择" allowClear>
											<Select.Option value="male">male</Select.Option>
											<Select.Option value="female">female</Select.Option>
											<Select.Option value="other">other</Select.Option>
										</Select>
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
								{fields.length > 0 ? (
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
		</Modal>
	);
});

const RuleCom = () => {
	const [data, setData] = React.useState();
	//使用弹框
	const [open, setOpen] = React.useState(false);
	const [form] = Form.useForm();
	//当前选中数据
	const [curRow, setCurRow] = React.useState({});
	useEffect(() => {
		const getData = async () => {
			setData([
				{
					key: '1',
					ruleName: '胡彦斌111',
					ruleUse: '西湖区湖底公园1号'
				},
				{
					key: '2',
					ruleName: '胡彦祖1111',
					ruleUse: '西湖区湖底公园1号'
				}
			]);
		};
		getData();
	}, []);

	const handleUse = (row, key) => {
		console.log(row);
		setOpen(true);
		setCurRow(row);
	};

	const onCreate = (values: any) => {
		console.log('Received values of form: ', values);
		setOpen(false);
	};

	const onReset = () => {
		form.resetFields();
	};

	const searchRule = (res) => {
		console.log(res);
	};

	const colums = [
		{
			title: '序号',
			dataIndex: 'key'
		},
		{
			title: '规则名称',
			dataIndex: 'ruleName'
		},
		{
			title: '规则用途',
			dataIndex: 'ruleUse'
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
			<div className="searchForm">
				<Form
					form={form}
					labelCol={{ span: 6 }}
					wrapperCol={{ span: 18 }}
					layout="inline"
					onFinish={(res: any) => {
						searchRule(res);
					}}
				>
					<Form.Item name="mainType" label="规则名称">
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
					<span style={{ marginRight: '10px' }}>共85条记录</span>
					<span>第1/50页</span>
				</div>
				<Pagination total={85} showSizeChanger showQuickJumper />
			</div>
			<UseModal
				open={open}
				curRow={curRow}
				onCreate={onCreate}
				onCancel={() => {
					setOpen(false);
				}}
			></UseModal>
		</div>
	);
};

export default RuleCom;
