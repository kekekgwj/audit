import React, { useEffect } from 'react';
// import './relationship.less';
import { Form, Input, Button, Radio, Select, InputNumber } from 'antd';
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
}

const SideBar = React.memo((props: Props) => {
	const [configVisibile, setconfigVisibile] = React.useState(true);
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
		console.log(configVisibile, 12555555);
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
							<Form.List name="users">
								{(fields, { add, remove }) => (
									<>
										{fields.map(({ key, name, ...restField }) => (
											<div key={key}>
												<Form.Item
													label="主体类型"
													{...restField}
													name={[name, 'first']}
												>
													<Select placeholder="请选择" allowClear>
														<Option value="male">male</Option>
														<Option value="female">female</Option>
														<Option value="other">other</Option>
													</Select>
												</Form.Item>
												<Form.Item
													label="主体名称"
													{...restField}
													name={[name, 'last']}
												>
													<Input placeholder="主体名称" />
												</Form.Item>
												{/* <MinusCircleOutlined onClick={() => remove(name)} /> */}
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
								<Select placeholder="请选择" allowClear>
									<Option value="male">male</Option>
									<Option value="female">female</Option>
									<Option value="other">other</Option>
								</Select>
							</Form.Item>
						</div>

						{/* <div className="relationship-filter">
							<div className="filter-item">
								<Space>
									<ApartmentOutlined />
								</Space>
								挖掘算法
							</div>
							<Form.Item name="algorithm" label="属性筛选">
								<Select placeholder="请选择" allowClear>
									<Option value="male">male</Option>
									<Option value="female">female</Option>
									<Option value="other">other</Option>
								</Select>
							</Form.Item>
						</div> */}
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
