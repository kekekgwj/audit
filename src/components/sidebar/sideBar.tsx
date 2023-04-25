import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, InputNumber, Space, Divider } from 'antd';
import { type GraphinData } from '@antv/graphin';
import {
	ApartmentOutlined,
	MinusCircleOutlined,
	PlusCircleOutlined,
	CaretUpOutlined,
	CaretDownOutlined
} from '@ant-design/icons';
import AttrFillter from './attr-filter';
import styles from './index.module.less';

interface Props {
	updateData: (layout: GraphinData) => void;
	toggleLayout: (isOpen: boolean) => void;
	canAdd: boolean;
}

interface bodyTypeOption {
	label: string;
	value: string | number;
}

export default (props: Props) => {
	const { updateData, toggleLayout, canAdd } = props;
	const [configVisibile, setconfigVisibile] = useState(true);
	const [bodyTypeOptions, setBodyTypeOptions] = useState(Array<bodyTypeOption>);
	const [form] = Form.useForm();
	const bodys = Form.useWatch('bodys', form);

	useEffect(() => {
		getBodyTypeOptions();
		initForm();
	}, []);

	// 获取主体类型下拉选项
	const getBodyTypeOptions = async () => {
		// todo 调用获取主体类型下拉选项接口
		setBodyTypeOptions([
			{ value: '001', label: '类型一' },
			{ value: '002', label: '类型二' },
			{ value: '003', label: '类型三' }
		]);
	};

	// 顶部筛选条件下拉切换
	const changeVisibile = (val: boolean) => {
		setconfigVisibile(!val);
		toggleLayout(!val);
	};

	// 渲染顶部
	const renderTpggleTab = () => (
		<div className={styles['toggle-tab']}>
			<div className={styles['tab-title']}>筛选条件</div>
			<div
				onClick={() => {
					changeVisibile(configVisibile);
				}}
			>
				<span>
					{configVisibile ? (
						<CaretUpOutlined style={{ fontSize: '14px', color: '#E6697B' }} />
					) : (
						<CaretDownOutlined style={{ fontSize: '14px', color: '#E6697B' }} />
					)}
				</span>
			</div>
		</div>
	);

	// 初始化表单数据
	const initForm = () => {
		form.setFieldsValue({
			bodys: [
				{
					bodyType: undefined,
					bodyName: undefined
				}
			],
			leval: 4
		});
	};

	// 提交表单 获取数据
	const searchUpdate = (res) => {
		// 调用接口 获取帅选数据
		console.log(res);

		// 获取之后，更新视图数据
		// updateData(res.data)
		// if (updateData) {
		// 	updateData({
		// 		nodes: [
		// 			{
		// 				id: 'node-0',
		// 				x: 100,
		// 				y: 100,
		// 				style: {
		// 					label: {
		// 						value: '我是node0',
		// 						position: 'center',
		// 						offset: [20, 5],
		// 						fill: 'green'
		// 					},
		// 					keyshape: {
		// 						size: 80,
		// 						stroke: '#ff9f0f',
		// 						fill: '#ff9f0ea6'
		// 					}
		// 				}
		// 			},
		// 			{
		// 				id: 'node-1',
		// 				x: 200,
		// 				y: 200,
		// 				style: {
		// 					label: {
		// 						value: '我是node1',
		// 						position: 'center',
		// 						offset: [20, 5],
		// 						fill: 'green'
		// 					},
		// 					keyshape: {
		// 						size: 60,
		// 						stroke: '#ff9f0f',
		// 						fill: '#ff9f0ea6'
		// 					}
		// 				}
		// 			},
		// 			{
		// 				id: 'node-2',
		// 				x: 100,
		// 				y: 300,
		// 				style: {
		// 					label: {
		// 						value: '我是node2',
		// 						position: 'center',
		// 						offset: [20, 5],
		// 						fill: 'green'
		// 					},
		// 					keyshape: {
		// 						size: 40,
		// 						stroke: '#ff9f0f',
		// 						fill: '#ff9f0ea6'
		// 					}
		// 				}
		// 			}
		// 		],
		// 		edges: [
		// 			{
		// 				id: 'edge-0-1',
		// 				source: 'node-0',
		// 				target: 'node-1',
		// 				style: {
		// 					label: {
		// 						value: '我是边1'
		// 					}
		// 				}
		// 			},
		// 			{
		// 				id: 'edge-1-2',
		// 				source: 'node-1',
		// 				target: 'node-2',
		// 				style: {
		// 					label: {
		// 						value: '我是边2'
		// 					},
		// 					keyshape: {
		// 						lineWidth: 5,
		// 						stroke: '#00f'
		// 					}
		// 				}
		// 			}
		// 		]
		// 	});
		// }
	};

	// 重置表单
	const onReset = () => {
		form.resetFields();
		form.setFieldsValue({
			bodys: [
				{
					bodyType: undefined,
					bodyName: undefined
				}
			],
			leval: 4
		});
	};

	// 渲染表单
	const renderForm = () => {
		return (
			<div className={styles['filter-form-box']}>
				<div className={styles['filter-form']}>
					<Form
						form={form}
						labelCol={{ span: 6 }}
						wrapperCol={{ span: 18 }}
						layout="horizontal"
						onFinish={searchUpdate}
					>
						<div className="main-filter">
							<div className={styles['filter-item']}>
								<Space>
									<ApartmentOutlined
										style={{ fontSize: '14px', color: '#E6697B' }}
									/>
								</Space>
								<span>主体筛选</span>
							</div>
							<Form.List name="bodys">
								{(fields, { add, remove }) => (
									<>
										{fields.map(({ key, name, ...restField }) => (
											<div key={key}>
												<Form.Item
													label="主体类型"
													{...restField}
													name={[name, 'bodyType']}
												>
													<Select
														placeholder="请选择"
														allowClear
														options={bodyTypeOptions}
													></Select>
												</Form.Item>
												<Form.Item
													label="主体名称"
													{...restField}
													name={[name, 'bodyName']}
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
											{canAdd ? (
												<span
													onClick={() => add()}
													style={{ cursor: 'pointer' }}
												>
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
											) : (
												<></>
											)}
										</Space>
									</>
								)}
							</Form.List>
						</div>

						<div>
							<div className={styles['filter-item']}>
								<Space>
									<ApartmentOutlined
										style={{ fontSize: '14px', color: '#E6697B' }}
									/>
								</Space>
								<span>主体过滤</span>
							</div>
							<Form.Item name="bodyFilter" label="主体类型">
								<Select
									mode="multiple"
									allowClear
									style={{ width: '100%' }}
									placeholder="请选择"
									options={bodyTypeOptions}
								/>
							</Form.Item>
						</div>

						<div>
							<div className={styles['filter-item']}>
								<Space>
									<ApartmentOutlined
										style={{ fontSize: '14px', color: '#E6697B' }}
									/>
								</Space>
								<span>关系层级</span>
							</div>
							<Form.Item
								name="leval"
								label="展示层级"
								initialValue={4}
								rules={[{ required: true }]}
							>
								<InputNumber min={0} max={6} />
							</Form.Item>
						</div>

						<div className={styles['filter-form__btns']}>
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
						<Divider dashed />
						<div>
							<div className={styles['filter-item']}>
								<Space>
									<ApartmentOutlined
										style={{ fontSize: '14px', color: '#E6697B' }}
									/>
								</Space>
								<span>链路筛选</span>
							</div>
							<Form.Item name="hierarchy" label="链路筛选">
								<AttrFillter data={{}}></AttrFillter>
							</Form.Item>
						</div>
						{!canAdd ? (
							<div>
								<div className={styles['filter-item']}>
									<Space>
										<ApartmentOutlined
											style={{ fontSize: '14px', color: '#E6697B' }}
										/>
									</Space>
									<span>挖掘算法</span>
								</div>
								<Form.Item name="algorithm" label="算法">
									<Select
										allowClear
										style={{ width: '100%' }}
										placeholder="请选择"
										options={bodyTypeOptions}
									/>
								</Form.Item>
							</div>
						) : (
							<></>
						)}
					</Form>
				</div>
			</div>
		);
	};

	return (
		<>
			{renderTpggleTab()}
			{configVisibile && renderForm()}
		</>
	);
};
