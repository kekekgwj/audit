import React, { FC, useEffect, useState } from 'react';
import classes from './index.module.less';
import { Button, Form, Select, Collapse } from 'antd';
import { DelIcon } from '../sort/icon';
import Icon, {
	CustomIconComponentProps
} from '@ant-design/icons/lib/components/Icon';
import { useConfigContextValue } from '../../NodeDetailPanel';
import { useGraph, useGraphContext, useGraphID } from '../../../lib/Graph';
import { getCanvasConfig, getResult } from '@/api/dataAnalysis/graph';
const { Panel } = Collapse;
const { Option } = Select;
interface SortProps {
	option?: List[];
	value?: ICondition[];
	onChange?: (value: string[]) => void;
	label: string;
}
interface List {
	title: string;
	key: string;
	list: {
		title: string;
		key: string;
	}[];
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

const SortInput: FC<SortProps> = ({ option = [], value, onChange, label }) => {
	const [dataList, setDataList] = useState<ICondition[]>(value || []);

	const setData = (item: { key: string; title: string }, tableName: string) => {
		if (
			!dataList.some((res) => {
				return res.key == item.key;
			})
		) {
			setDataList([
				...dataList,
				{
					title: item.title,
					key: item.key,
					tableName
				}
			]);
		}
	};

	//监听dataList改变触发onChange
	useEffect(() => {
		onChange?.(dataList);
	}, [dataList]);

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
						<div className={classes.inputLabel}>{label}</div>
						<div className={classes.rightInput}>
							<div className={classes.left}>
								{dataList.map((item, index) => {
									return (
										<div className={classes.label} key={item.key}>
											{item.title}
											<DelIcon
												onClick={() => {
													const newData = JSON.parse(JSON.stringify(dataList));
													newData.splice(index, 1);
													setDataList(newData);
												}}
												className={classes.delIcon}
											></DelIcon>
										</div>
									);
								})}
							</div>
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
					{option.map((item, index) => {
						return (
							<Panel header={item.title} key={index + 1}>
								{item.list.map((items, _) => {
									return (
										<div
											key={items.title}
											className={classes.sortTxt}
											onClick={() => {
												setData(items, item.title);
											}}
										>
											<span>{items.title}</span>
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
interface ICondition {
	title: string;
	key: string;
	tableName: string;
}
interface IFormValue {
	column: ICondition[];
	conditions: ICondition[];
	funcType: string;
}
const Grouping: FC = () => {
	const graph = useGraph();
	const projectID = useGraphID();
	const canvasData = graph?.toJSON();
	const [form] = Form.useForm();
	const { id, getValue, setValue, resetValue } = useConfigContextValue();
	const formInitValue: IFormValue = (getValue && id && getValue(id)) || {};

	const getConfig = async () => {
		const params = {
			id,
			canvasJson: JSON.stringify({
				content: canvasData
			})
		};
		const res = await getCanvasConfig(params);
		setGroupData(transData(res));
		setAccordData(transData(res));
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
					title: el.fieldName,
					key: i
				});
			});
			return {
				title: item.tableCnName,
				key: index,
				list: list
			};
		});
		return formatData;
	};
	const [groupData, setGroupData] = useState<List[]>();
	const [accordData, setAccordData] = useState<List[]>();

	const onFinish = (values: any) => {
		const params = {
			canvasJson: JSON.stringify({
				content: canvasData,
				configs: { [id]: values }
			}),
			executeId: id, //当前选中元素id
			projectId: projectID
		};
		getResult(params).then((res: any) => {
			if (res.head && res.head.length) {
				//生成columns
				const colums = res.head.map((item, index) => {
					return {
						title: item,
						dataIndex: item
					};
				});
				// 根据表头和数据拼接成可渲染的表数据
				// const tableData = transToTableData(res.head, res.data);
				// updateTable(tableData, colums);
			}
		});
	};
	const handleOnChange = (value: any) => {
		if (!id || !setValue) {
			return;
		}
		setValue(id, value);
	};
	const onReset = () => {
		form.resetFields();
		id && resetValue(id);
	};

	return (
		<Form
			{...layout}
			form={form}
			name="control"
			onFinish={onFinish}
			className={classes.fromWrap}
			onValuesChange={(_, value) => {
				handleOnChange(value);
			}}
			initialValues={{
				conditions: formInitValue.conditions || [],
				funcType: formInitValue.funcType,
				column: formInitValue.column || []
			}}
		>
			<div className={classes.formList}>
				<Form.Item
					wrapperCol={{ offset: 0, span: 24 }}
					name="conditions"
					label=""
				>
					<SortInput label="分组依据" option={groupData}></SortInput>
				</Form.Item>
				<Form.Item name="funcType" label="函数类型">
					<Select placeholder="请选择" allowClear>
						<Option value="SUM">求和</Option>
						<Option value="MAX">最大</Option>
						<Option value="MIN">最小</Option>
					</Select>
				</Form.Item>
				<Form.Item wrapperCol={{ offset: 0, span: 24 }} name="column" label="">
					<SortInput label="列" option={accordData}></SortInput>
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
