import React, { FC, useEffect, useState } from 'react';
import classes from './index.module.less';
import { Button, Form, Select, Collapse } from 'antd';
import { DelIcon } from '../sort/icon';
import Icon, {
	CustomIconComponentProps
} from '@ant-design/icons/lib/components/Icon';
import { useConfigContextValue } from '../../NodeDetailPanel';
import { useGraphPageInfo, useGraphContext } from '../../../lib/hooks';

const { Panel } = Collapse;
const { Option } = Select;
interface SortProps {
	option?: List[];
	value?: ICondition[];
	onChange?: (value: ICondition[]) => void;
	label: string;
	isMulti?: boolean;
}
interface List {
	tableName: string;
	key: string;
	list: {
		description: string;
		title: string;
		key: string;
	}[];
	tableRealName: string;
}

const layout = {
	labelCol: { span: 3 },
	wrapperCol: { span: 21 },
	labelAlign: 'left'
};

const tailLayout = {
	wrapperCol: { offset: 24, span: 0 }
};

const HeartSvg = () => (
	<svg
		width="11"
		height="9"
		viewBox="0 0 11 9"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			id="Polygon 9"
			d="M6.36603 8.5C5.98113 9.16667 5.01887 9.16667 4.63397 8.5L0.73686 1.75C0.35196 1.08333 0.833086 0.249999 1.60289 0.249999L9.39712 0.25C10.1669 0.25 10.648 1.08333 10.2631 1.75L6.36603 8.5Z"
			fill="#979797"
		/>
	</svg>
);
const HeartIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={HeartSvg} {...props} />
);

const SortInput: FC<SortProps> = ({
	option = [],
	value,
	onChange,
	label,
	isMulti = false,
	disabled
}) => {
	// 设置为undefined， 避免useEffect中空值重置保存的config value
	const [dataList, setDataList] = useState<ICondition[] | undefined>(value);
	const setData = (
		item: {
			key: string;
			title: string;
			description: string;
		},
		tableRealName: string
	) => {
		const curDataList = dataList || [];
		if (
			!curDataList.some((res) => {
				return res.key == item.key;
			})
		) {
			setDataList([
				...curDataList,
				{
					title: item.title,
					key: item.key,
					tableName: tableRealName,
					description: item.description
				}
			]);
		}
	};

	//监听dataList改变触发onChange
	useEffect(() => {
		// !避免回显错误
		if (!dataList) return;
		// !
		onChange?.(dataList);
	}, [dataList]);

	return (
		<Collapse
			collapsible="icon"
			className={classes.wrapBoxCollapse}
			ghost
			expandIcon={() => <div className={classes.expandIcon}></div>}
		>
			<Panel
				header={
					<div className={classes.inputWrap}>
						<div className={classes.inputLabel}>{label}</div>
						<div className={classes.rightInput}>
							<div className={classes.left}>
								{dataList && dataList.length > 0 ? (
									dataList.map((item, index) => {
										return (
											<div className={classes.label} key={item.key}>
												{item.description}
												{!disabled && (
													<DelIcon
														onClick={() => {
															const newData = JSON.parse(
																JSON.stringify(dataList)
															);
															newData.splice(index, 1);
															setDataList(newData);
														}}
														className={classes.delIcon}
													></DelIcon>
												)}
											</div>
										);
									})
								) : (
									<div className={classes.tip}>请选择</div>
								)}
							</div>
						</div>
					</div>
				}
				key="1"
			>
				{!disabled && (
					<Collapse
						className={classes.boxCollapse}
						ghost
						defaultActiveKey={
							option &&
							option.map((res, index) => {
								return index + 1;
							})
						}
						expandIcon={({ isActive }) => (
							<HeartIcon
								style={{
									transform: isActive ? 'rotate(0deg)' : 'rotate(-90deg)',
									transition: 'all linear .25s'
								}}
							/>
						)}
					>
						{option.map((item, index) => {
							const { tableRealName, tableName } = item;

							return (
								<Panel header={tableName} key={index + 1}>
									{item.list.map((items, _) => {
										return (
											<div
												key={items.title}
												className={classes.sortTxt}
												onClick={() => {
													if (isMulti) {
														setData(items, tableRealName, tableName);
													} else {
														if (!dataList) {
															setData(items, tableRealName, tableName);
														}
													}
												}}
											>
												<span>{items.description}</span>
											</div>
										);
									})}
								</Panel>
							);
						})}
					</Collapse>
				)}
			</Panel>
		</Collapse>
	);
};
interface ICondition {
	title: string;
	key: string;
	tableName: string;
	description: string;
}
interface IFormValue {
	column: ICondition[];
	conditions: ICondition[];
	funcType: string;
}
const Grouping: FC = () => {
	const { isPublicTemplate } = useGraphContext();
	const [form] = Form.useForm();
	const {
		id,
		setValue,
		resetValue,
		executeByNodeConfig,
		initValue = {},
		config
	} = useConfigContextValue();

	const getConfig = () => {
		setGroupData(transData(config));
		setAccordData(transData(config));
	};
	//获取配置项数据
	useEffect(() => {
		getConfig();
	}, []);

	const transData = (data: any) => {
		const formatData = data.map((item, index) => {
			const listArr = item.fields;
			const list = [];
			listArr?.forEach((el, i) => {
				list.push({
					description: el.description || el.fieldName,
					title: el.fieldName,
					key: i
				});
			});
			return {
				tableRealName: item.tableName,
				tableName: item.tableCnName,
				key: index,
				list: list
			};
		});
		return formatData;
	};
	const [groupData, setGroupData] = useState<List[]>();
	const [accordData, setAccordData] = useState<List[]>();

	const onFinish = async () => {
		executeByNodeConfig();
	};
	const handleOnChange = (value: any) => {
		if (!id || !setValue) {
			return;
		}

		setValue(value);
	};
	const onReset = () => {
		form.resetFields();
		id && resetValue();
	};
	return (
		<Form
			disabled={isPublicTemplate}
			{...layout}
			form={form}
			name="control"
			onFinish={onFinish}
			className={classes.fromWrap}
			onValuesChange={(_, value) => {
				handleOnChange(value);
			}}
			initialValues={{
				conditions: initValue.conditions,
				funcType: initValue.funcType,
				column: initValue.column
			}}
		>
			<div className={classes.formList}>
				<Form.Item
					wrapperCol={{ offset: 0, span: 24 }}
					name="conditions"
					label=""
				>
					<SortInput
						disabled={isPublicTemplate}
						isMulti
						label="分组依据"
						option={groupData}
					></SortInput>
				</Form.Item>
				<Form.Item
					className={classes.funcType}
					wrapperCol={{ offset: 0, span: 24 }}
					name="funcType"
					label="函数类型"
				>
					<Select placeholder="请选择" allowClear>
						<Option value="SUM">求和</Option>
						<Option value="MAX">最大</Option>
						<Option value="MIN">最小</Option>
					</Select>
				</Form.Item>
				<Form.Item wrapperCol={{ offset: 0, span: 24 }} name="column" label="">
					<SortInput
						label="列"
						option={accordData}
						disabled={isPublicTemplate}
					></SortInput>
				</Form.Item>
			</div>

			<Form.Item {...tailLayout}>
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
			</Form.Item>
		</Form>
	);
};
export default Grouping;
