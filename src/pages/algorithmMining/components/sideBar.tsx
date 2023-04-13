import React, { useEffect } from 'react';
// import './relationship.less';
import { Form, Input, Button, Radio, Select, InputNumber, Modal } from 'antd';
import {
	ApartmentOutlined,
	MinusCircleOutlined,
	PlusOutlined,
	PlusCircleOutlined,
	CaretUpOutlined,
	CaretDownOutlined
} from '@ant-design/icons';
import { Space } from 'antd';

interface Props {
	updateData: (layout: any) => void;
	isModalOpen: boolean;
	setIsModalOpen: (layout: any) => void;
}

// 属性筛选弹框
const AttrModal = React.memo((props: Props) => {
	const { isModalOpen, setIsModalOpen } = props;
	const [form] = Form.useForm();

	const handleOk = () => {
		setIsModalOpen(false);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	const saveData = (res) => {
		console.log(res);
	};
	return (
		<Modal
			title="属性筛选"
			open={isModalOpen}
			onOk={handleOk}
			onCancel={handleCancel}
		>
			<Form
				form={form}
				labelCol={{ span: 6 }}
				wrapperCol={{ span: 18 }}
				layout="horizontal"
				onFinish={(res: any) => {
					saveData(res);
				}}
			>
				<Form.Item name="mainName" label="主体名称">
					<Input />
				</Form.Item>
			</Form>
		</Modal>
	);
});

const SideBar = React.memo((props: Props) => {
	const [configVisibile, setconfigVisibile] = React.useState(true);
	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const { updateData } = props;
	const [form] = Form.useForm();
	// 提交表单 获取数据
	const searchUpdate = (res) => {
		// 调用接口 获取帅选数据
		console.log(res);
		// 获取之后，更新视图数据
		if (updateData) {
			updateData({
				nodes: [
					{
						id: 'node-0',
						x: 100,
						y: 100,
						style: {
							label: {
								value: '我是node0',
								position: 'center',
								offset: [20, 5],
								fill: 'green'
							},
							keyshape: {
								size: 80,
								stroke: '#ff9f0f',
								fill: '#ff9f0ea6'
							}
						}
					},
					{
						id: 'node-1',
						x: 200,
						y: 200,
						style: {
							label: {
								value: '我是node1',
								position: 'center',
								offset: [20, 5],
								fill: 'green'
							},
							keyshape: {
								size: 60,
								stroke: '#ff9f0f',
								fill: '#ff9f0ea6'
							}
						}
					},
					{
						id: 'node-2',
						x: 100,
						y: 300,
						style: {
							label: {
								value: '我是node2',
								position: 'center',
								offset: [20, 5],
								fill: 'green'
							},
							keyshape: {
								size: 40,
								stroke: '#ff9f0f',
								fill: '#ff9f0ea6'
							}
						}
					}
				],
				edges: [
					{
						id: 'edge-0-1',
						source: 'node-0',
						target: 'node-1',
						style: {
							label: {
								value: '我是边1'
							}
						}
					},
					{
						id: 'edge-1-2',
						source: 'node-1',
						target: 'node-2',
						style: {
							label: {
								value: '我是边2'
							},
							keyshape: {
								lineWidth: 5,
								stroke: '#00f'
							}
						}
					}
				]
			});
		}
	};
	const onReset = () => {
		form.resetFields();
	};

	const changeVisibile = (val) => {
		setconfigVisibile(!val);
	};

	const changeAttr = (val) => {
		if (val == 1) {
			console.log('111');
			setIsModalOpen(true);
		} else if (val == 2) {
			console.log('222');
		}
	};

	if (configVisibile) {
		return (
			<div>
				<div className="toggle-tab">
					<div className="tab-title">筛选条件</div>
					<div
						onClick={() => {
							changeVisibile(configVisibile);
						}}
					>
						<span>
							<CaretUpOutlined style={{ fontSize: '14px', color: '#E6697B' }} />
						</span>
					</div>
				</div>
				<div className="filter-form">
					<Form
						form={form}
						labelCol={{ span: 6 }}
						wrapperCol={{ span: 18 }}
						layout="horizontal"
						onFinish={(res: any) => {
							searchUpdate(res);
						}}
					>
						<div class="main-filter">
							<div className="filter-item">
								<Space>
									<ApartmentOutlined
										style={{ fontSize: '14px', color: '#E6697B' }}
									/>
								</Space>
								<span>主体筛选</span>
							</div>
							<Form.Item name="mainType" label="主体类型">
								<Select placeholder="请选择" allowClear>
									<Option value="male">male</Option>
									<Option value="female">female</Option>
									<Option value="other">other</Option>
								</Select>
							</Form.Item>
							<Form.Item name="mainName" label="主体名称">
								<Input />
							</Form.Item>
						</div>

						<div className="relationship-hierarchy">
							<div className="filter-item">
								<Space>
									<ApartmentOutlined
										style={{ fontSize: '14px', color: '#E6697B' }}
									/>
								</Space>
								<span>关系层级</span>
							</div>
							<Form.Item
								name="hierarchy"
								label="展示层级"
								rules={[{ required: true }]}
							>
								<InputNumber min={0} max={6} defaultValue={4} />
							</Form.Item>
						</div>

						<div className="relationship-filter">
							<div className="filter-item">
								<Space>
									<ApartmentOutlined
										style={{ fontSize: '14px', color: '#E6697B' }}
									/>
								</Space>
								<span>关系筛选</span>
							</div>
							<Form.Item name="relationshipType" label="关系类型">
								<Select placeholder="请选择" allowClear>
									<Option value="male">male</Option>
									<Option value="female">female</Option>
									<Option value="other">other</Option>
								</Select>
							</Form.Item>
						</div>

						<div className="relationship-filter">
							<div className="filter-item">
								<Space>
									<ApartmentOutlined
										style={{ fontSize: '14px', color: '#E6697B' }}
									/>
								</Space>
								<span>属性筛选</span>
							</div>
							<Form.Item name="attribute" label="属性筛选">
								<Select placeholder="请选择" allowClear onChange={changeAttr}>
									<Option value="1">主体属性</Option>
									<Option value="2">关系属性</Option>
								</Select>
							</Form.Item>
						</div>

						<div className="relationship-filter">
							<div className="filter-item">
								<Space>
									<ApartmentOutlined />
								</Space>
								挖掘算法
							</div>
							<Form.Item name="algorithm" label="算法">
								<Select placeholder="请选择" allowClear>
									<Option value="male">male</Option>
									<Option value="female">female</Option>
									<Option value="other">other</Option>
								</Select>
							</Form.Item>
						</div>
						<div style={{ textAlign: 'right', width: '100%' }}>
							<Button
								htmlType="button"
								onClick={onReset}
								style={{ marginRight: '10px' }}
							>
								重置
							</Button>
							<Button type="primary" htmlType="submit">
								查询
							</Button>
						</div>
					</Form>
				</div>
				<AttrModal
					isModalOpen={isModalOpen}
					setIsModalOpen={setIsModalOpen}
				></AttrModal>
			</div>
		);
	} else {
		return (
			<div>
				<div className="toggle-tab">
					<div className="tab-title">筛选条件</div>
					<div
						onClick={() => {
							changeVisibile(configVisibile);
						}}
					>
						<span>
							<CaretDownOutlined
								style={{ fontSize: '14px', color: '#E6697B' }}
							/>
						</span>
					</div>
				</div>
			</div>
		);
	}
});

export default SideBar;
