import React, {
	FC,
	useEffect,
	useState,
	forwardRef,
	useImperativeHandle,
	useRef
} from 'react';
import { Checkbox, Input, Radio, DatePicker, Form } from 'antd';
import styles from './index.module.less';
const { RangePicker } = DatePicker;
import SpecialCom from '../../luoji/index';
import MyTag from '../../myTag/index';
import { INodeConfigNProps } from './index';

interface Option {
	key: string;
	label: string;
	defaultValue: number | string | boolean | Array<any>;
	type: any;
	dict?: any[];
}
interface IProps {
	initValues: INodeConfigNProps;
	formChange: (key: string, allValues: any) => void; //表单改变之后返回的值
	id: string;
}
const getComponent = (option: Option, props) => {
	const { value } = props;
	const { type, key, dict } = option;
	if (type == '1') {
		return {
			component: MyTag
		};
	}

	if (type == '4') {
		return {
			component: Radio.Group,
			props: {
				options: dict
			}
		};
	}
	if (type === '3') {
		return {
			component: RangePicker,
			props: {
				format: 'YYYY-MM-DD'
			}
		};
	}
	if (type == '2') {
		return {
			component: SpecialCom,
			props: {}
		};
	}
};

const FillterAttr: FC<IProps> = forwardRef(
	({ formChange, initValues, id }, ref: any) => {
		const { configInfo, properties } = initValues;
		console.log('configInfo', configInfo);
		const [form] = Form.useForm();
		useImperativeHandle(ref, () => ({
			form: form
		}));
		//  测试数据
		const myData = [
			{ key: 'person', label: '人员', value: null, type: 1 },
			{ key: 'range', label: '范围', value: null, type: 2 },
			{
				label: '性别',
				value: null,
				type: '4',
				key: 'gender',
				dict: [
					{ label: '男', value: '1' },
					{ label: '女', value: '2' }
				]
			},
			{
				label: '日期',
				value: null,
				key: 'date',
				type: '3'
			}
		];
		const latestFormData = useRef<object>({});
		// 自定义组件传值
		const setData = (target, data) => {
			const formData = {
				...latestFormData.current,
				[target]: data
			};

			latestFormData.current = formData;
			formChange(id, latestFormData);
			console.log('formDta', formData);
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
					onValuesChange={(changedValues, allValues) => {
						const updateFormData = { ...latestFormData.current, ...allValues };

						formChange(id, updateFormData);
						latestFormData.current = updateFormData;
					}}
				>
					{myData.map((item) => {
						const { label, value, key, type } = item;
						const { component: Component, props: ComponentProps } =
							getComponent(item, {
								value: value
							});
						if (type == '1') {
							return (
								<div key={key}>
									<MyTag label={label} ikey={key} setData={setData}></MyTag>
								</div>
							);
						} else if (type == '2') {
							return (
								<div key={key}>
									<SpecialCom
										label={label}
										ikey={key}
										setOperator={setData}
									></SpecialCom>
								</div>
							);
						} else {
							return (
								<div key={key}>
									<Form.Item label={label} name={key}>
										<Component {...ComponentProps} />
									</Form.Item>
								</div>
							);
						}
					})}
				</Form>
			</div>
		);
	}
);
export default FillterAttr;
