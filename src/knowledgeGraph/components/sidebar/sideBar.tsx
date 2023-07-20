import React, { useEffect, useImperativeHandle, useState } from 'react';
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
	IPath,
	getAlgs
} from '@/api/knowLedgeGraph/graphin';
import { onSetSelectID } from '@/redux/store';
interface Props {
	curData: any; //当前图谱数据 用来判断链路和算法是否可用 为空时禁用
	updateData: (layout: GraphinData) => void;
	toggleLayout: (isOpen: boolean) => void;
	canAdd: boolean; //是否可添加多个主体
	setdefaultName: (name: string) => void;
	onRef: React.MutableRefObject<unknown>;
	resetAllNextGraph: () => void;
	getAllNextGraphInfo: () => void;
	setIsClusterLayout: (val: boolean) => void;
	setLoading: (val: boolean) => void;
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
	algorithm: any;
	paths: any;
}
export enum FormItems {
	bodys = 'bodys',
	bodyFilter = 'bodyFilter',
	level = 'level',
	pathFilter = 'pathFilter',
	algorithm = 'algorithm',
	paths = 'paths'
}
export default (props: Props) => {
	const {
		updateData,
		toggleLayout,
		canAdd,
		setdefaultName,
		curData,
		onRef,
		resetAllNextGraph,
		getAllNextGraphInfo,
		setIsClusterLayout = () => {},
		setLoading
	} = props;
	const [filterNAlgorithDisable, setFilterNAlgorithDisable] =
		useState<boolean>(false);
	const [configVisibile, setconfigVisibile] = useState(true);
	const [bodyTypeOptions, setBodyTypeOptions] = useState(Array<bodyTypeOption>);
	const [algorithmOptions, setAlgorithmOptions] = useState(
		Array<algorithmOption>
	);

	const [form] = Form.useForm();
	const bodys = Form.useWatch('bodys', form);
	const bodyFilter = Form.useWatch('bodyFilter', form);
	useEffect(() => {
		setFilterNAlgorithDisable(true);
	}, [bodys]);
	useEffect(() => {
		if (bodys?.length > 1) {
			form.setFieldValue('level', 4);
			form.setFieldValue('paths', null);
		} else {
			form.setFieldValue('level', 1);
		}
	}, [bodys?.length]);
	useEffect(() => {
		getBodyTypeOptions();
		initForm();
	}, []);

	// 根据条件获取算法
	useEffect(() => {
		if (!canAdd) {
			getAlgorithmOptions();
		}
	}, []);
	useImperativeHandle(onRef, () => {
		return {
			getGraph: searchUpdate
		};
	});

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
	const getAlgorithmOptions = async () => {
		const res = await getAlgs();
		setAlgorithmOptions(res);
	};

	// 顶部筛选条件下拉切换
	const changeVisibile = (val: boolean) => {
		setconfigVisibile(!val);
		toggleLayout(!val);
	};

	// 渲染顶部
	const renderTpggleTab = () => (
		<div className={styles['toggle-tab']}>
			<div className={styles['tab-title']}>条件筛选</div>
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
			level: 1
		});
	};

	// 提交表单 获取数据
	const searchUpdate = async (isPenetrate = false) => {
		setIsClusterLayout && setIsClusterLayout(false);
		if (!isPenetrate) {
			// 重置select id
			onSetSelectID({ selectID: null });
			// 重置穿透下一层
			resetAllNextGraph();
		}

		const formData: IFormData = form.getFieldsValue();
		// 调用接口 获取筛选数据
		const { bodyFilter, bodys, level, algorithm, paths } = formData;
		// setTimeout(() => {
		// 	if (setIsClusterLayout) {
		// 		if (['louvain', 'label_propagation'].includes(algorithm)) {
		// 			setIsClusterLayout(true);
		// 		} else {
		// 			setIsClusterLayout(false);
		// 		}
		// 	}
		// }, 2000);

		//设置主体为默认保存图谱名称
		setdefaultName(bodys[0].bodyName);
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
			setLoading(true);
			const data = await getGraph({
				algorithmName: algorithm,
				depth: level, //多主体时传5
				nodeFilter: bodyFilter,
				nodes,
				paths,
				nextGraphs: getAllNextGraphInfo()
			});
			setLoading(false);
			if (data.limited) {
				if (algorithm) {
					message.warning(
						'您查询的数据量过多，因前端展示效果限制仅针对展示数据做算法应用'
					);
				} else {
					message.warning(
						'您查询的数据量过多，页面无法显示完整的数据结果，请添加限制条件'
					);
				}
			}

			const nodesData = data.nodes || [];
			const edgesData = data.edges || [];
			if (nodesData.length === 0) {
				message.error('查询结果为空');
			}
			// 获取之后，更新视图数据
			updateData({
				nodes: nodesData,
				edges: edgesData
			});
			setFilterNAlgorithDisable(false);
		} catch (e) {
			setLoading(false);
			updateData({
				nodes: [],
				edges: []
			});
		}
	};

	// 算法改变
	const handleAlgorithmChange = (value: string) => {
		// searchUpdate({ algorithmName: value, pathFilter: curPath });
	};
	const isGroupAlgorithm = () => {
		const algorithm = getFormItemValue(FormItems.algorithm);
		return ['louvain', 'label_propagation'].includes(algorithm);
	};
	const handleGroup = () => {
		if (setIsClusterLayout && isGroupAlgorithm()) {
			setIsClusterLayout((prevState) => {
				return !prevState;
			});
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
			level: 1
		});
		// 将链路和算法置灰
		updateData('');
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
	const getFilterKey = () => {
		//主体类型过滤改变需从新触发链路筛选
		let curBodyFilter;
		if (bodyFilter && bodyFilter.length) {
			curBodyFilter = bodyFilter.join('-');
		} else {
			curBodyFilter = '';
		}
		if (
			bodys &&
			Array.isArray(bodys) &&
			bodys[0].bodyName &&
			bodys[0].bodyType
		) {
			const curNodeType = bodys[0].bodyType as string;
			const curNodeVaule = bodys[0].bodyName as string;
			return curNodeType + '-' + curNodeVaule + '-' + curBodyFilter;
		}
		return Date.now();
	};

	const handleChangeBodyType = (key: any, e: any) => {
		// if (!e) {
		// 	const bodys = form.getFieldValue('bodys');
		// 	bodys[key].bodyName = '';
		// 	form.setFieldValue('bodyName', bodys);
		// }
		const bodys = form.getFieldValue('bodys');
		bodys[key].bodyName = '';
		form.setFieldValue('bodyName', bodys);
		// 重置链路
		form.setFieldValue('paths', null);
	};

	const handleChangeBodyFilter = (e: any) => {
		form.setFieldValue('paths', null);
	};

	// 渲染表单
	const renderForm = () => {
		return (
			// <div className={styles['filter-form-box']}>
			<div
				className={`${styles['filter-form-box']} ${
					!configVisibile ? styles['filter-form-hide'] : ''
				}`}
			>
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
								<span>主体查询</span>
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
														listHeight={300}
														placeholder="请选择"
														allowClear
														options={bodyTypeOptions}
														onChange={(e) => {
															handleChangeBodyType(key, e);
														}}
													></Select>
												</Form.Item>
												<Form.Item
													label="主体名称"
													{...restField}
													name={[name, 'bodyName']}
													className={styles['filter-form-item']}
												>
													<Input placeholder="主体名称" allowClear={true} />
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
											{canAdd && fields.length < 3 ? (
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
									listHeight={300}
									mode="multiple"
									allowClear
									style={{ width: '100%' }}
									placeholder="请选择"
									options={bodyTypeOptions}
									onChange={(e) => {
										handleChangeBodyFilter(e);
									}}
								/>
							</Form.Item>
						</div>

						<div>
							<div
								className={styles['filter-item']}
								// className={`${styles['filter-item']} ${
								// 	bodys?.length > 1 ? styles['filter-item-disable'] : ''
								// }`}
							>
								<SvgIcon name="filter"></SvgIcon>
								<span>关系层级</span>
							</div>
							<Form.Item
								name={FormItems.level}
								label="查询层级"
								initialValue={1}
								className={styles['filter-form-item']}
								// className={`${styles['filter-form-item']} ${
								// 	bodys?.length > 1 ? styles['filter-label-disable'] : ''
								// }`}
							>
								<InputNumber
									min={1}
									max={bodys?.length > 1 ? 4 : 6}
									// disabled={bodys?.length > 1 ? true : false}
								/>
							</Form.Item>
						</div>

						{/* <div className={styles['filter-form__btns']}>
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
						</div> */}
						{/* <Divider dashed /> */}
						<div>
							<div
								className={`${styles['filter-item']} ${
									bodys?.length > 1 ? styles['filter-item-disable'] : ''
								}`}
							>
								<SvgIcon name="filter"></SvgIcon>
								<span>链路筛选</span>
							</div>
							<Form.Item
								name={FormItems.paths}
								label="链路筛选"
								// className={`${
								// 	bodys?.length > 1 || !curData
								// 		? styles['filter-label-disable']
								// 		: ''
								// }`}
								className={`${
									bodys?.length > 1 ? styles['filter-label-disable'] : ''
								}`}
							>
								<AttrFillter
									key={getFilterKey()}
									canUse={bodys?.length === 1}
									getFormItemValue={getFormItemValue}
									setFormItemValue={setFormItemValue}
									// updateGraph={(path: IPath[]) =>
									// 	searchUpdate({ pathFilter: path })
									// }
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
										// onChange={handleAlgorithmChange}
										// disabled={!curData || filterNAlgorithDisable}
									>
										{algorithmOptions.map((item) => {
											return (
												<Select.Option value={item.type} key={item.id}>
													<div className={styles['title-options']}>
														<div className={styles['option-select-label']}>
															{item.name}
														</div>
														<div className={styles['option-item-tips']}>
															<span className={styles['option-description']}>
																<SvgIcon
																	name="help"
																	className={styles['option-description-icon']}
																></SvgIcon>
																<span
																	className={styles['option-description-text']}
																>
																	{item.description
																		? item.description
																		: '暂无说明'}
																</span>
															</span>
														</div>
													</div>
												</Select.Option>
											);
										})}
									</Select>
								</Form.Item>
							</div>
						) : (
							<></>
						)}
						<div className={styles['filter-form__btns']}>
							{isGroupAlgorithm() && (
								<Button
									onClick={() => {
										handleGroup();
									}}
								>
									group
								</Button>
							)}
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
	};

	return (
		<>
			{renderTpggleTab()}
			{/* {configVisibile && renderForm()} */}
			{renderForm()}
		</>
	);
};
