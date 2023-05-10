import React, {
	FC,
	useEffect,
	useState,
	forwardRef,
	useImperativeHandle
} from 'react';
import { Checkbox, Input, Radio, DatePicker, Form } from 'antd';
import styles from './index.module.less';
const { RangePicker } = DatePicker;
import SpecialCom from '../../luoji/index';
import MyTag from '../../myTag/index';

interface Option {
	key: string;
	label: string;
	defaultValue: number | string | boolean | Array;
	type: any;
	dict?: any[];
}
interface Props {
	properties: any[];
	fromChange: Function; //表单改变之后返回的值
}
const getComponent = (option: Option, props) => {
	const { onChange, value } = props;
	const { type, key, dict } = option;
	if (type == '1') {
		return {
			component: MyTag,
			props: {
				// onChange: (e) => {
				// 	onChange(key, e.target.value);
				// }
			}
		};
	}

	if (type == '4') {
		return {
			component: Radio.Group,
			props: {
				options: dict,
				onChange: (e) => {
					onChange(key, e.target.value);
				}
			}
		};
	}
	if (type === '3') {
		return {
			component: RangePicker,
			props: {
				format: 'YYYY-MM-DD',
				onChange: (val) => {
					onChange(key, [val[0], val[1]]);
				}
			}
		};
	}
	if (type == '2') {
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

const FillterAttr: FC<Props> = forwardRef(
	({ fromChange, properties }: Props, ref: any) => {
		const [form] = Form.useForm();
		useImperativeHandle(ref, () => ({
			form: form
		}));
		const [newFormData, setFormData] = useState({});
		const dataList = [
			{
				key: 'input1',
				data: [
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
				]
			},
			{
				key: 'input2',
				data: [
					{
						label: '姓名',
						defaultValue: '',
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
						label: '自定义',
						key: 'number',
						condition: 3,
						component: 'custom',
						defaultValue: {}
					}
				]
			},
			{
				key: 'input3',
				data: [
					{
						label: '籍贯3',
						defaultValue: '杭州',
						condition: 1,
						component: 'Input',
						key: 'native'
					},
					{
						label: '性别3',
						defaultValue: '1',
						component: 'Radio',
						key: 'gender',
						enums: [
							{ label: '男', value: '1' },
							{ label: '女', value: '2' }
						]
					},
					{
						label: '时间3',
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
				]
			}
		];
		const [Options, setOptions] = useState([]);
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
		useEffect(() => {
			console.log(properties);
			setOptions(myData);
		}, [properties]);
		// useEffect(() => {
		// 	//fromType改变后筛选出对应的表单结构
		// 	if (fromType) {
		// 		const newData = dataList.find((res) => {
		// 			return res.key == fromType;
		// 		});
		// 		setOptions(newData.data);
		// 	} else {
		// 		setOptions([]);
		// 	}
		// }, [fromType]);
		const onChange = (key, val) => {
			const data = {
				...newFormData,
				[key]: val
			};
			setFormData(data);
		};

		useEffect(() => {
			console.log(newFormData, 115115);
			fromChange(newFormData);
		}, [newFormData]);

		// 自定义组件传值
		const setData = (target, data) => {
			const formData = {
				...newFormData,
				[target]: data
			};
			setFormData(formData);
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
				>
					{Options.map((item) => {
						const { label, value, key, type } = item;
						const { component: Component, props: ComponentProps } =
							getComponent(item, {
								onChange,
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
