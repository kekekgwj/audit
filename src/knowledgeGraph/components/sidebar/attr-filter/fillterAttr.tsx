import React from 'react';
import { Checkbox, Input, Radio, DatePicker, Form } from 'antd';
import styles from './index.module.less';
const { RangePicker } = DatePicker;
import SpecialCom from '../../luoji/index';

interface Option {
	key: string;
	label: string;
	defaultValue: number | string | boolean | Array;
	component: 'Input' | 'Radio' | 'RangePicker';
	enums?: any[];
}

const getComponent = (option: Option, props) => {
	const { onChange, value } = props;

	const { component, key, enums } = option;

	if (component === 'Input') {
		return {
			component: Input,
			props: {
				onChange: (e) => {
					onChange(key, e.target.value);
				}
			}
		};
	}

	if (component === 'Radio') {
		return {
			component: Radio.Group,
			props: {
				options: enums,
				onChange: (e) => {
					onChange(key, e.target.value);
				}
			}
		};
	}
	if (component === 'RangePicker') {
		return {
			component: RangePicker,
			props: {
				format: 'YYYY-MM-DD',
				onChange: (val) => {
					onChange(key, [
						val[0].format('YYYY-MM-DD'),
						val[1].format('YYYY-MM-DD')
					]);
				}
			}
		};
	}
	if (component === 'custom') {
		return {
			component: SpecialCom,
			props: {
				// onChange: (e) => {
				// 	onChange(key, e.target.value);
				// }
			}
		};
	}
};

export default () => {
	const [form] = Form.useForm();
	const [newFormData, setFormData] = React.useState({});
	const Options = [
		{
			label: '籍贯',
			defaultValue: '杭州',
			condition: 1,
			component: 'Input',
			key: 'native'
		},
		{
			label: '性别',
			defaultValue: '1',
			component: 'Radio',
			key: 'gender',
			enums: [
				{ label: '男', value: '1' },
				{ label: '女', value: '2' }
			]
		},
		{
			label: '时间',
			key: 'time',
			defaultValue: [],
			component: 'RangePicker'
		},
		{
			label: '自定义',
			key: 'number',
			condition: 3,
			component: 'custom',
			defaultValue: {}
		}
	];

	const onChange = (key, val) => {
		const data = {
			...newFormData,
			[key]: val
		};
		setFormData(data);
		console.log(data, 9888888);
	};

	const initForm = (data) => {
		form.setFieldsValue(data);
	};

	const getData = () => {
		let data = form.getFieldsValue();
		console.log(data, 119119119);
	};

	return (
		<div className={styles['fillter-attr-box']}>
			{/* <div className="fillter-attr-box__title">供应商</div>
			<div className="fillter-attr-box__attrs">
				<div className={styles['attr-item']}>
					<Checkbox className={styles['attr-item__checkbox']}>籍贯</Checkbox>
					<div className={styles['attr-item__value']}>
						<Input placeholder="请输入" />
					</div>
				</div>
				<div className={styles['attr-item']}>
					<Checkbox className={styles['attr-item__checkbox']}>性别</Checkbox>
					<div className={styles['attr-item__value']}>
						<Radio.Group>
							<Radio value={1}>男</Radio>
							<Radio value={2}>女</Radio>
						</Radio.Group>
					</div>
				</div>
				<div className={styles['attr-item']}>
					<Checkbox className={styles['attr-item__checkbox']}>时间</Checkbox>
					<div className={styles['attr-item__value']}>
						<RangePicker placeholder={['开始时间', '结束时间']} />
					</div>
				</div>
			</div> */}
			<div className="fillter-attr-box__title">供应商</div>
			<Form
				name="basic"
				labelCol={{ span: 4 }}
				wrapperCol={{ span: 20 }}
				style={{ maxWidth: 600 }}
				initialValues={{ remember: true }}
				autoComplete="off"
				form={form}
			>
				{Options.map((item) => {
					const { label, defaultValue, key } = item;
					const { component: Component, props: ComponentProps } = getComponent(
						item,
						{
							onChange,
							value: defaultValue
						}
					);
					if (item.component == 'custom') {
						return (
							<>
								<SpecialCom
									form={form}
									initForm={initForm}
									label={label}
									ikey={key}
								></SpecialCom>
							</>
						);
					} else {
						return (
							<>
								<Form.Item label={label} name={key}>
									<Component {...ComponentProps} />
								</Form.Item>
							</>
						);
					}
				})}
			</Form>
			<div className="fillter-attr-box__title" onClick={() => getData()}>
				OK
			</div>
		</div>
	);
};
