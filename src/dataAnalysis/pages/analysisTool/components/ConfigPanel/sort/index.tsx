import React, { FC, useState, useEffect } from 'react';
import classes from './index.module.less';
import { Button, Form, Collapse } from 'antd';
import { UpIcon, Downicon, HeartIcon, DelIcon } from './icon';
import { useConfigContextValue } from '../../NodeDetailPanel';
const { Panel } = Collapse;

interface SortProps {
	option: List[];
	value?: string[];
	onChange?: (value: ISortInitValue[]) => void;
}
interface IListItem {
	description?: string;
	title: string;
	isUp: boolean;
	isDown: boolean;
}
interface List {
	tableName: string;
	title: string;
	list: IListItem[];
}
interface IConfigRaw {
	fields: {
		dataType: number;
		description: string;
		fieldName: string;
		id: number;
		tableName: string;
	}[];
	tableCnName: string;
	tableName: string;
}
interface ISortInitValue {
	isDown: boolean;
	isUp: boolean;
	tableName: string;
	title: string;
}

interface IInitValue {
	sorting: ISortInitValue[];
}
interface IFormatInitValue {
	[key: string]: {
		[name: string]: {
			isDown: boolean;
			isUp: boolean;
		};
	};
}
const layout = {
	labelCol: { span: 0 },
	wrapperCol: { span: 24 },
	labelAlign: 'left'
};

const SortInput: FC<SortProps> = ({ value, onChange, option }) => {
	const [optionList, setOptionList] = useState<List[]>(option);

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
	const transSubmitData = (rawData: List[]): ISortInitValue[] => {
		const formatData: ISortInitValue[] = [];
		rawData.forEach(({ list, tableName }) => {
			list.forEach((item) => {
				formatData.push({
					tableName: tableName,
					title: item.title,
					isDown: item.isDown,
					isUp: item.isUp
				});
			});
		});
		return formatData;
	};
	//监听optionList改变触发onChange
	useEffect(() => {
		if (!optionList) return;
		onChange?.(transSubmitData(optionList));
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
							{optionList &&
							optionList.every((res) => {
								return res.list.every((ress) => {
									return !ress.isDown && !ress.isUp;
								});
							}) ? (
								<div className={classes.defaultTxt}>请选择</div>
							) : (
								<div className={classes.left}>
									{optionList &&
										optionList.map((item, index) => {
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
					{optionList &&
						optionList.map((item, index) => {
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
	const [form] = Form.useForm();

	const {
		id,
		setValue,
		resetValue,
		executeByNodeConfig,
		getValue,
		config,
		initValue
	} = useConfigContextValue();
	const [option, setOption] = useState<List[]>();
	useEffect(() => {
		const initSortingValue: ISortInitValue[] = initValue.sorting;
		const initConfig: IFormatInitValue = {};

		if (initSortingValue) {
			initSortingValue.forEach(({ tableName, title, isDown, isUp }) => {
				initConfig[tableName] = {
					...initConfig[tableName],
					[title]: { isDown, isUp }
				};
			});
		}
		console.log('initConfig', initSortingValue, initConfig);
		const formatData = transData(config, initConfig);

		setOption(formatData);
	}, []);

	//转数据形式
	const transData = (
		data: IConfigRaw[],
		initConfig: IFormatInitValue
	): List[] => {
		if (!data || !Array.isArray(data)) {
			return [];
		}

		const formatData = data.map((item) => {
			const { fields, tableCnName, tableName } = item;
			const list: IListItem[] = [];
			fields?.forEach((el) => {
				let [isDownValue, isUpValue] = [false, false];
				const { tableName } = item;
				const { fieldName, description } = el;
				if (initConfig) {
					if (initConfig[tableName] && initConfig[tableName][fieldName]) {
						const init = initConfig[tableName][fieldName];
						if (init) {
							[isDownValue, isUpValue] = [init.isDown, init.isUp];
						}
					}
				}
				list.push({
					description: description || fieldName,
					title: fieldName,
					isUp: isUpValue,
					isDown: isDownValue
				});
			});
			return {
				tableName: tableName,
				title: tableCnName,
				list: list
			};
		});
		console.log('formatdata', formatData, initConfig);
		return formatData;
	};

	const onFinish = () => {
		executeByNodeConfig();
	};

	const onReset = () => {
		form.resetFields();
		id && resetValue();
	};
	const handleSortChange = (v) => {
		if (!id || !setValue) {
			return;
		}
		setValue(v);
	};
	return (
		<Form
			{...layout}
			form={form}
			name="control"
			onFinish={onFinish}
			className={classes.fromWrap}
			onValuesChange={(_, value) => {
				handleSortChange(value);
			}}
		>
			<div className={classes.formList}>
				<Form.Item name="sorting">
					<SortInput option={option} key={option}></SortInput>
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
