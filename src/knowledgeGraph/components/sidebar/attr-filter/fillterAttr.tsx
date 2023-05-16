import React, { FC, forwardRef, useImperativeHandle, useRef } from 'react';
import { Radio, DatePicker, Form } from 'antd';
import styles from './index.module.less';
const { RangePicker } = DatePicker;
import SpecialCom from '../../luoji/index';
import MyTag from '../../myTag/index';
import { INodeConfigNProps } from './index';

interface Option {
	name: string;
	label: string;
	defaultValue?: number | string | boolean | Array<any>;
	type: string;
	dict?: any[];
	updateFormChange: (changeData: object) => void;
}
interface IProps {
	initValues: INodeConfigNProps;
	formChange: (key: string, allValues: any) => void; //表单改变之后返回的值
	id: string;
}

export enum ComponentsType {
	PERSON = '1',
	RANGE = '2',
	DATE = '3',
	GENDER = '4'
}

const CustomizedComponent = (option: Option) => {
	const {
		label,
		type,
		name,
		dict,
		defaultValue = null,
		updateFormChange
	} = option;

	if (type == ComponentsType.PERSON) {
		return (
			<Form.Item label={label}>
				<MyTag
					label={label}
					name={name}
					setData={updateFormChange}
					value={defaultValue}
				/>
			</Form.Item>
		);
	}

	if (type == ComponentsType.RANGE) {
		return (
			<SpecialCom
				label={label}
				name={name}
				setOperator={updateFormChange}
				value={defaultValue}
			></SpecialCom>
		);
	}
	if (type == ComponentsType.DATE) {
		return (
			<Form.Item label={label}>
				<RangePicker
					format={'YYYY-MM-DD'}
					onChange={(date, dateString) =>
						updateFormChange({
							[name]: {
								value: dateString,
								type: ComponentsType.DATE,
								key: name
							}
						})
					}
				/>
			</Form.Item>
		);
	}
	if (type == ComponentsType.GENDER) {
		return (
			<Form.Item label={label}>
				<Radio.Group
					options={dict}
					onChange={(e) =>
						updateFormChange({
							[name]: {
								value: e.target.value,
								type: ComponentsType.GENDER,
								key: name
							}
						})
					}
				/>
			</Form.Item>
		);
	}
	return null;
};

const FillterAttr: FC<IProps> = forwardRef(
	({ formChange, initValues, id }, ref: any) => {
		const { configInfo, properties } = initValues;
		const [form] = Form.useForm();
		// const [curProperties,setCurProp] = useState()
		useImperativeHandle(ref, () => ({
			form: form
		}));
		//  测试数据
		// const myData = [
		// 	{ key: 'person', label: '人员', value: null, type: '1' },
		// 	{ key: 'range', label: '范围', value: null, type: '2' },
		// 	{
		// 		label: '性别',
		// 		value: null,
		// 		type: '4',
		// 		key: 'gender',
		// 		dict: [
		// 			{ label: '男', value: '1' },
		// 			{ label: '女', value: '2' }
		// 		]
		// 	},
		// 	{
		// 		label: '日期',
		// 		value: null,
		// 		key: 'date',
		// 		type: '3'
		// 	}
		// ];
		const latestFormData = useRef<object>({});
		const updateFormChange = (changeData: object) => {
			const formData = {
				...latestFormData.current,
				...changeData
			};
			latestFormData.current = formData;
			formChange(id, formData);
		};

		return (
			<div className={styles['fillter-attr-box']}>
				<div className="fillter-attr-box__title">供应商</div>
				<Form
					name="basic"
					labelCol={{ span: 4 }}
					wrapperCol={{ span: 20 }}
					style={{ maxWidth: 600 }}
					autoComplete="off"
					form={form}
					onValuesChange={(allValues) => {
						updateFormChange(allValues);
					}}
				>
					{properties.map((item, index) => {
						const { label, key, type, dict } = item;
						return (
							<div key={index}>
								<CustomizedComponent
									name={key}
									type={type}
									label={label}
									dict={dict}
									updateFormChange={updateFormChange}
								/>
							</div>
						);
					})}
				</Form>
			</div>
		);
	}
);
export default FillterAttr;
