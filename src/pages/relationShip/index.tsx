import React, { useEffect } from 'react';
import './relationship.less';
import { Form, Input, Button, Radio, Select, InputNumber } from 'antd';
import {
	ApartmentOutlined,
	MinusCircleOutlined,
	PlusOutlined
} from '@ant-design/icons';
import { Space } from 'antd';
import Graphin, {
	Behaviors,
	GraphinContext,
	IG6GraphEvent,
	Components
} from '@antv/graphin';

const { Tooltip } = Components;

interface Props {
	updateData: (layout: any) => void;
}
// 左边筛选条件展示
const SideBar = React.memo((props: Props) => {
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
	return (
		<div>
			<div className="toggle-tab">
				<div>筛选条件</div>
				<div>展开/收起</div>
			</div>
			<div className="filter-form">
				<Form
					form={form}
					labelCol={{ span: 4 }}
					wrapperCol={{ span: 14 }}
					layout="horizontal"
					style={{ maxWidth: 600 }}
					onFinish={(res: any) => {
						searchUpdate(res);
					}}
				>
					<div class="main-filter">
						<div className="filter-item">
							<Space>
								<ApartmentOutlined />
							</Space>
							主体筛选
						</div>
						<Form.Item
							name="mainType"
							label="主体类型"
							rules={[{ required: true }]}
						>
							<Select placeholder="请选择" allowClear>
								<Option value="male">male</Option>
								<Option value="female">female</Option>
								<Option value="other">other</Option>
							</Select>
						</Form.Item>
						<Form.Item
							name="mainName"
							label="主体名称"
							rules={[{ required: true }]}
						>
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
												rules={[
													{ required: true, message: 'Missing first name' }
												]}
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
												rules={[
													{ required: true, message: 'Missing last name' }
												]}
											>
												<Input placeholder="主体名称" />
											</Form.Item>
											{/* <MinusCircleOutlined onClick={() => remove(name)} /> */}
										</div>
									))}
									<Form.Item>
										{fields.length > 0 ? (
											<Button
												type="dashed"
												onClick={() => {
													remove(fields[fields.length - 1].name);
												}}
												icon={<MinusCircleOutlined />}
											>
												Remove field
											</Button>
										) : (
											<></>
										)}
										<Button
											type="dashed"
											onClick={() => add()}
											icon={<PlusOutlined />}
										>
											Add field
										</Button>
									</Form.Item>
								</>
							)}
						</Form.List>
					</div>

					<div className="relationship-hierarchy">
						<div className="filter-item">
							<Space>
								<ApartmentOutlined />
							</Space>
							关系层级
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
								<ApartmentOutlined />
							</Space>
							关系筛选
						</div>
						<Form.Item
							name="relationshipType"
							label="关系类型"
							rules={[{ required: true }]}
						>
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
								<ApartmentOutlined />
							</Space>
							属性筛选
						</div>
						<Form.Item
							name="attribute"
							label="属性筛选"
							rules={[{ required: true }]}
						>
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
					</div>
					<Form.Item>
						<Button htmlType="button" onClick={onReset}>
							重置
						</Button>
						<Button type="primary" htmlType="submit">
							查询
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
});

const mockData: GraphinData = {
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
		},
		{
			id: 'edge-2-0',
			source: 'node-2',
			target: 'node-0',
			style: {
				label: {
					value: '我是边3'
				}
			}
		}
	]
};

const RelationShipCom = () => {
	// 数据来源
	const [data, setDate] = React.useState(mockData);

	// 更新数据
	const updateData = (value) => {
		setDate(value);
	};
	return (
		<div class="main-content">
			<div className="filter-bar">
				<SideBar updateData={updateData}></SideBar>
			</div>
			<div>
				<Graphin data={data}>
					<Tooltip bindType="node" placement={'top'}>
						{(value: TooltipValue) => {
							if (value.model) {
								const { model } = value;
								console.log(model.id, 421111111);
								return (
									<div>
										<li> {model.id}</li>
										<li> {model.id}</li>
										<li> {model.id}</li>
										<li> {model.id}</li>
										<li> {model.id}</li>
										<li> {model.id}</li>
									</div>
								);
							}
							return null;
						}}
					</Tooltip>
				</Graphin>
			</div>
		</div>
	);
};

export default RelationShipCom;
