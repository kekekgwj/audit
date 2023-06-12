import React, { FC, useState, useEffect } from 'react';
import classes from './index.module.less';
import { Button, Form, Collapse } from 'antd';
import { UpIcon, Downicon, HeartIcon, DelIcon } from './icon';
import { DownOutlined } from '@ant-design/icons';
import { useConfigContextValue } from '../../NodeDetailPanel';
const { Panel } = Collapse;
import { useGraph, useGraphContext, useGraphID } from '../../../lib/Graph';
import { getCanvasConfig, getResult } from '@/api/dataAnalysis/graph';
import { config } from 'process';

interface SortProps {
	option?: List[];
	value?: string[];
	onChange?: (value: string[]) => void;
	dataList: [];
}

interface List {
	title: string;
	list: {
		title: string;
		isUp: boolean;
		isDown: boolean;
	}[];
}
interface ISortAll {}
const layout = {
	labelCol: { span: 0 },
	wrapperCol: { span: 24 },
	labelAlign: 'left'
};

const SortInput: FC<SortProps> = ({ value, onChange, dataList }) => {
	const [optionList, setOptionList] = useState<List[]>(dataList);

	//通过传入的状态值和下标修改dataList的排序状态
	const setSortStatus = (
		data: { isUp: boolean; isDown: boolean },
		index: number,
		childrenIndex: number
	) => {
		const newDataList = JSON.parse(JSON.stringify(optionList));
		newDataList[index].list[childrenIndex].isUp = data.isUp;
		newDataList[index].list[childrenIndex].isDown = data.isDown;

		setOptionList(newDataList);
	};
	useEffect(() => {
		setOptionList(dataList);
	}, [dataList]);
	//监听optionList改变触发onChange
	useEffect(() => {
		// let newData: string[] = [];
		// optionList.forEach((res) => {
		// 	res.list.forEach((ress) => {
		// 		if (ress.isDown || ress.isUp) {
		// 			newData.push(ress.title);
		// 		}
		// 	});
		// });
		// onChange?.(optionList);
	}, [optionList]);
	return (
		<Collapse
			collapsible="icon"
			activeKey={'1'}
			className={classes.wrapBoxCollapse}
			ghost
			expandIcon={() => <div></div>}
		>
			<Panel
				header={
					<div className={classes.inputWrap}>
						<div>排序</div>
						<div className={classes.rightInput}>
							{optionList.every((res) => {
								return res.list.every((ress) => {
									return !ress.isDown && !ress.isUp;
								});
							}) ? (
								<div className={classes.defaultTxt}>请选择</div>
							) : (
								<div className={classes.left}>
									{optionList.map((item, index) => {
										return item.list.map((items, childrenIndex) => {
											return (
												(items.isUp || items.isDown) && (
													<div className={classes.label} key={items.title}>
														{items.title}
														<div style={{ marginLeft: '6px' }}>
															{items.isUp && <UpIcon />}
															{items.isDown && <Downicon />}
														</div>
														<DelIcon
															onClick={() => {
																setSortStatus(
																	{ isUp: false, isDown: false },
																	index,
																	childrenIndex
																);
															}}
															className={classes.delIcon}
														></DelIcon>
													</div>
												)
											);
										});
									})}
								</div>
							)}
						</div>
					</div>
				}
				key="1"
			>
				<Collapse
					className={classes.boxCollapse}
					ghost
					expandIcon={({ isActive }) => (
						<HeartIcon
							style={{
								transform: isActive ? 'rotate(0deg)' : 'rotate(-90deg)',
								transition: 'all linear .25s'
							}}
						/>
					)}
				>
					{optionList.map((item, index) => {
						return (
							<Panel header={item.title} key={index + 1}>
								{item.list.map((items, childrenIndex) => {
									return (
										<div key={items.title} className={classes.sortTxt}>
											<span>{items.title}</span>
											<div className={classes.sortWrap}>
												<div
													style={{ marginRight: '10px' }}
													onClick={() => {
														setSortStatus(
															{ isUp: !items.isUp, isDown: false },
															index,
															childrenIndex
														);
													}}
													className={`${classes.sortBtn} ${
														items.isUp && classes.activeBtn
													}`}
												>
													升 <UpIcon />
												</div>
												<div
													onClick={() => {
														setSortStatus(
															{ isUp: false, isDown: !items.isDown },
															index,
															childrenIndex
														);
													}}
													className={`${classes.sortBtn} ${
														items.isDown && classes.activeBtn
													}`}
												>
													降 <Downicon />
												</div>
											</div>
										</div>
									);
								})}
							</Panel>
						);
					})}
				</Collapse>
			</Panel>
		</Collapse>
	);
};

const Sort: FC = () => {
	const graph = useGraph();
	const projectID = useGraphID();
	const canvasData = graph.toJSON();
	const [form] = Form.useForm();
	const { id, getValue, setValue, resetValue, updateTable } =
		useConfigContextValue();
	// 存储配置项（包含值）
	// const formInitValue = getValue && id && getValue(id);
	// console.log('formInitValue', formInitValue);
	// 配置项
	const [dataList, setDataList] = useState([]);

	//转数据形式
	const transData = (data: any) => {
		const formatData = data.map((item) => {
			const listArr = item.fields;
			const list = [];
			listArr?.forEach((el) => {
				list.push({
					title: el.fieldName,
					isUp: false,
					isDown: false
				});
			});
			return {
				title: item.tableCnName,
				list: list
			};
		});
		return formatData;
	};
	const getConfigForm = async () => {
		const params = {
			id,
			canvasJson: JSON.stringify({
				content: canvasData
			})
		};
		const configs = await getCanvasConfig(params);
		const formatForm = transData(configs);
		setDataList(formatForm);
	};

	// 获取配置项
	useEffect(() => {
		getConfigForm();
	}, []);
	const onFinish = (values: any) => {
		console.log(values);
		const params = {
			canvasJson: JSON.stringify({
				content: canvasData,
				configs: { [id]: values.sorting }
			}),
			executeId: id, //当前选中元素id
			projectId: projectID
		};
		getResult(params).then((res: any) => {
			updateTable(res.data, res.head);
		});
	};

	const onReset = () => {
		form.resetFields();
		id && resetValue(id);
	};
	const handleSortChange = (v) => {
		if (!id || !setValue) {
			return;
		}
		setValue(id, v);
	};
	return (
		<Form
			{...layout}
			form={form}
			name="control"
			onFinish={onFinish}
			className={classes.fromWrap}
			initialValues={{
				sorting: dataList
			}}
		>
			<div className={classes.formList}>
				<Form.Item name="sorting">
					<SortInput
						onChange={handleSortChange}
						value={dataList}
						dataList={dataList}
					></SortInput>
				</Form.Item>
			</div>

			<div style={{ justifyContent: 'end', display: 'flex', width: '100%' }}>
				<Button
					className={`${classes.btn} ${classes.reset}`}
					htmlType="button"
					onClick={onReset}
				>
					重置
				</Button>
				<Button
					className={`${classes.btn} ${classes.submit}`}
					type="primary"
					htmlType="submit"
				>
					执行
				</Button>
			</div>
		</Form>
	);
};

export default Sort;
