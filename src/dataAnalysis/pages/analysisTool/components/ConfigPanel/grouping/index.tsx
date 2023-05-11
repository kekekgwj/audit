import React, { FC } from 'react';
import classes from './index.module.less';
import { Button, Form, Select, Collapse } from 'antd';
import Icon, {
	CustomIconComponentProps
} from '@ant-design/icons/lib/components/Icon';
const { Panel } = Collapse;
const { Option } = Select;

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

const Grouping: FC = () => {
	const [form] = Form.useForm();

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
				<Form.Item name="according" label="分组依据">
					<Select placeholder="请选择" onChange={onGenderChange} allowClear>
						<Option value="male">male</Option>
						<Option value="female">female</Option>
						<Option value="other">other</Option>
					</Select>
				</Form.Item>
				<Collapse
					className={classes.boxCollapse}
					defaultActiveKey={['1']}
					onChange={onChange}
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
					<Panel header="数据表1" key="1">
						字段1
					</Panel>
					<Panel header="数据表2" key="2">
						字段2
					</Panel>
					<Panel header="数据表3" key="3">
						字段3
					</Panel>
				</Collapse>
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
