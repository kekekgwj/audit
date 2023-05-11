import React, { FC, useEffect, useState } from 'react';
import classes from './index.module.less';
import { Button, Form, Select, Collapse } from 'antd';
import { DelIcon } from '../sort/icon';
import Icon, {
	CustomIconComponentProps
} from '@ant-design/icons/lib/components/Icon';
const { Panel } = Collapse;
const { Option } = Select;
interface SortProps {
	option?: List[];
	value?: string[];
	onChange?: (value: string[]) => void;
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

const SortInput: FC<SortProps> = ({ option = [], value, onChange }) => {
	const [optionList, setOptionList] = useState<List[]>(
		JSON.parse(JSON.stringify(option))
	);

	const [dataList, setDataList] = useState<{ key: string; title: string }[]>(
		[]
	);

	const setData = (item: { key: string; title: string }) => {
		if (
			!dataList.some((res) => {
				return res.key == item.key;
			})
		) {
			setDataList([...dataList, item]);
		}
	};

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
						<div className={classes.inputLabel}>排序</div>
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
					{optionList.map((item, index) => {
						return (
							<Panel header={item.title} key={index + 1}>
								{item.list.map((items, childrenIndex) => {
									return (
										<div
											key={items.title}
											className={classes.sortTxt}
											onClick={() => {
												setData(items);
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

const Grouping: FC = () => {
	const [form] = Form.useForm();

	const [accordingData, setAccordingData] = useState<List[]>([
		//分组依据列表数据
		{
			title: '数据表1',
			key: '0',
			list: [
				{ title: '字段1', key: '0-1' },
				{ title: '字段2', key: '0-2' }
			]
		},
		{
			title: '数据表2',
			key: '1',
			list: [{ title: '字段2', key: '1-1' }]
		},
		{
			title: '数据表3',
			key: '2',
			list: [{ title: '字段3', key: '2-1' }]
		}
	]);
	const onGenderChange = (value: string) => {
		switch (value) {
			case 'male':
				form.setFieldsValue({ note: 'Hi, man!' });
				break;
			case 'female':
				form.setFieldsValue({ note: 'Hi, lady!' });
				break;
			case 'other':
				form.setFieldsValue({ note: 'Hi there!' });
				break;
			default:
		}
	};

	const onFinish = (values: any) => {
		console.log(values);
	};

	const onReset = () => {
		form.resetFields();
	};

	const onChange = (key: string | string[]) => {
		console.log(key);
	};

	return (
		<Form
			{...layout}
			form={form}
			name="control"
			onFinish={onFinish}
			className={classes.fromWrap}
		>
			<div className={classes.formList}>
				<SortInput option={accordingData}></SortInput>

				<Form.Item name="type" label="函数类型">
					<Select placeholder="请选择" onChange={onGenderChange} allowClear>
						<Option value="male">male</Option>
						<Option value="female">female</Option>
						<Option value="other">other</Option>
					</Select>
				</Form.Item>
				<Form.Item name="arrange" label="列">
					<Select placeholder="请选择" onChange={onGenderChange} allowClear>
						<Option value="male">male</Option>
						<Option value="female">female</Option>
						<Option value="other">other</Option>
					</Select>
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
