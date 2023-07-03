import React, { FC, forwardRef, useImperativeHandle, useRef } from 'react';
import { Radio, DatePicker, Form, Checkbox } from 'antd';
import styles from './index.module.less';
const { RangePicker } = DatePicker;
import SpecialCom from '../../luoji/index';
import MyTag from '../../myTag/index';
import DateCom from '../../dateCom/index';
import CheckCom from '../../checkCom/index';
import { INodeConfigNProps } from './index';
import dayjs from 'dayjs';

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

export const ComponentsType = {
	PERSON: ['1'],
	RANGE: ['2'],
	DATE: ['3', '4'],
	GENDER: ['8', '9']
};

const CustomizedComponent = (option: Option) => {
	const {
		label,
		type,
		name,
		dict,
		defaultValue = null,
		updateFormChange
	} = option;

	if (ComponentsType.PERSON.includes(String(type))) {
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

	if (ComponentsType.RANGE.includes(String(type))) {
		return (
			<SpecialCom
				label={label}
				name={name}
				setOperator={updateFormChange}
				value={defaultValue}
			></SpecialCom>
		);
	}
	if (ComponentsType.DATE.includes(String(type))) {
		return (
			<Form.Item label={label}>
				<DateCom
					label={label}
					name={name}
					setData={updateFormChange}
					value={defaultValue}
					type={type}
				/>
			</Form.Item>
		);
	}
	if (ComponentsType.GENDER.includes(String(type))) {
		const options = dict?.map((item) => {
			return {
				label: item.label,
				value: item.key
			};
		});
		return (
			<Form.Item label={label}>
				<CheckCom
					label={label}
					name={name}
					setData={updateFormChange}
					value={defaultValue}
					options={options}
					type={type}
				/>
			</Form.Item>
		);
	}
	return null;
};

const FillterAttr: FC<IProps> = forwardRef(
	({ formChange, initValues, id }, ref: any) => {
		const { configInfo, properties } = initValues;
		console.log(configInfo, 123123);
		properties.forEach((item, index) => {
			for (let key in configInfo) {
				if (item.key == key) {
					// if (item.type != 2) {
					// 	item.value = configInfo[key].value || null;
					// } else {
					// 	item.value = {
					// 		operationLinks: configInfo[key].value.operationLinks || null,
					// 		operations: configInfo[key].value.operations || null
					// 	};
					// }
					item.value = configInfo[key].value || null;
				}
			}
		});
		console.log(properties, 128128128);
		const [form] = Form.useForm();
		// const [curProperties,setCurProp] = useState()
		useImperativeHandle(ref, () => ({
			form: form
		}));
		// 测试数据;
		// const myData = [
		// 	{ key: 'person', label: '人员', value: null, type: '1' },
		// 	{ key: 'range', label: '范围测试一个很长的数据', value: null, type: '2' },
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
			console.log(formData, 170170170);
			formChange(id, formData);
		};

		return (
			<div className={styles['fillter-attr-box']}>
				{/* <div className="fillter-attr-box__title">供应商</div> */}
				<Form
					name="basic"
					// labelCol={{ span: 6 }}
					// wrapperCol={{ span: 18 }}
					layout="vertical"
					style={{ maxWidth: 600, maxHeight: 380, overflowY: 'auto' }}
					autoComplete="off"
					form={form}
					onValuesChange={(allValues) => {
						updateFormChange(allValues);
					}}
				>
					{properties.map((item, index) => {
						const { label, key, type, dict, value } = item;
						return (
							<div key={index} style={{ maxWidth: '370px' }}>
								<CustomizedComponent
									name={key}
									type={type}
									label={label}
									dict={dict}
									defaultValue={value}
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
