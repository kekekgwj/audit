import React, { useEffect, useState } from 'react';
import {
	Form,
	Input,
	Button,
	Select,
	InputNumber,
	Space,
	Divider,
	message
} from 'antd';
import { type GraphinData } from '@antv/graphin';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import SvgIcon from '@/components/svg-icon';
import AttrFillter from './attr-filter';
import styles from './index.module.less';

import {
	getMainNodes,
	getGraph,
	IFilterNode,
	IPath
} from '@/api/knowledgeGraph/graphin';
interface Props {
	updateData: (layout: GraphinData) => void;
	toggleLayout: (isOpen: boolean) => void;
	canAdd: boolean;
	setdefaultName: (name: string) => void;
}

interface bodyTypeOption {
	label: string;
	value: string | number;
}
interface algorithmOption {
	label: string;
	value: string;
}
interface IBody {
	// 主体类型对应的id
	bodyType: string;
	// 主体名称
	bodyName: string;
}
interface IFormData {
	bodyFilter: string[];
	// 主体类型ID
	bodys: IBody[];
	level: number;
	pathFilter: any;
}
export enum FormItems {
	bodys = 'bodys',
	bodyFilter = 'bodyFilter',
	level = 'level',
	pathFilter = 'pathFilter',
	algorithm = 'algorithm'
}
export default (props: Props) => {
	const { updateData, toggleLayout, canAdd, setdefaultName } = props;
	const [configVisibile, setconfigVisibile] = useState(true);
	const [bodyTypeOptions, setBodyTypeOptions] = useState(Array<bodyTypeOption>);
	const [algorithmOptions, setAlgorithmOptions] = useState(
		Array<algorithmOption>
	);
	const [form] = Form.useForm();
	const bodys = Form.useWatch('bodys', form);

	useEffect(() => {
		getBodyTypeOptions();
		getAlgorithmOptions();
		initForm();
	}, []);

	// 获取主体类型下拉选项
	const getBodyTypeOptions = async () => {
		const nodes = await getMainNodes();
		const options = nodes.map(({ id, name }) => {
			return {
				label: name,
				value: name
			};
		});

		setBodyTypeOptions(options);
	};

	//获取算法下拉选型
	// 待完善
	const getAlgorithmOptions = async () => {
		// const nodes = await getMainNodes();
		// const options = nodes.map(({ id, name }) => {
		// 	return {
		// 		label: name,
		// 		value: name
		// 	};
		// });
		const options = [{ label: 'louvain', value: 'louvain' }];
		setAlgorithmOptions(options);
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
				className={
					configVisibile
						? `${styles['tab-icon']} ${styles['visibile']}`
						: styles['tab-icon']
				}
				onClick={() => {
					changeVisibile(configVisibile);
				}}
			>
				<SvgIcon name="arrow-down"></SvgIcon>
				{/* {configVisibile ? (
						<CaretUpOutlined style={{ fontSize: '14px', color: '#E6697B' }} />
					) : (
						<CaretDownOutlined style={{ fontSize: '14px', color: '#E6697B' }} />
					)} */}
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
			level: 4
		});
	};

	// 提交表单 获取数据
	const searchUpdate = async ({
		pathFilter = null,
		algorithmName = ''
	}: {
		pathFilter?: IPath[] | null;
		algorithmName?: string;
	} = {}) => {
		const formData: IFormData = form.getFieldsValue();
		// 调用接口 获取筛选数据
		const { bodyFilter, bodys, level } = formData;
		const nodes: IFilterNode[] = [];
		bodys.forEach(({ bodyType, bodyName }) => {
			if (bodyType && bodyName) {
				nodes.push({
					type: bodyType,
					value: bodyName
				});
			}
		});
		if (nodes.length === 0) {
			message.error('未选择主体');
			return;
		}
		try {
			const data = await getGraph({
				algorithmName,
				depth: level,
				nodeFilter: bodyFilter,
				nodes,
				paths: pathFilter
			});

			// 获取之后，更新视图数据
			updateData({
				nodes: data.nodes || [],
				edges: data.edges || []
			});
		} catch (e) {
			console.error(e);
		}
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
			level: 4
		});
	};
	const getFormItemValue = (name: FormItems) => {
		if (form) {
			return form.getFieldValue(name);
		}
		return null;
	};
	const setFormItemValue = (name: FormItems, value: any) => {
		if (form) {
			form.setFieldValue(name, value);
		}
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
						labelAlign="left"
						layout="horizontal"
						onFinish={() => searchUpdate()}
					>
						<div className="main-filter">
							<div className={styles['filter-item']}>
								<SvgIcon name="filter"></SvgIcon>
								<span>主体筛选</span>
							</div>
							<Form.List name={FormItems.bodys}>
								{(fields, { add, remove }) => (
									<>
										{fields.map(({ key, name, ...restField }) => (
											<div key={key}>
												<Form.Item
													label="主体类型"
													{...restField}
													name={[name, 'bodyType']}
													className={styles['filter-form-item']}
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
													className={styles['filter-form-item']}
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
								<SvgIcon name="filter"></SvgIcon>
								<span>主体过滤</span>
							</div>
							<Form.Item name={FormItems.bodyFilter} label="主体类型">
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
								<SvgIcon name="filter"></SvgIcon>
								<span>关系层级</span>
							</div>
							<Form.Item
								name={FormItems.level}
								label="展示层级"
								initialValue={4}
								className={styles['filter-form-item']}
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
								<SvgIcon name="filter"></SvgIcon>
								<span>链路筛选</span>
							</div>
							<Form.Item name={FormItems.pathFilter} label="链路筛选">
								<AttrFillter
									getFormItemValue={getFormItemValue}
									setFormItemValue={setFormItemValue}
									updateGraph={(path: IPath[]) =>
										searchUpdate({ pathFilter: path })
									}
								/>
							</Form.Item>
						</div>
						{!canAdd ? (
							<div>
								<div className={styles['filter-item']}>
									<SvgIcon name="filter"></SvgIcon>
									<span>挖掘算法</span>
								</div>
								<Form.Item name={FormItems.algorithm} label="算法">
									<Select
										allowClear
										style={{ width: '100%' }}
										placeholder="请选择"
										options={algorithmOptions}
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
