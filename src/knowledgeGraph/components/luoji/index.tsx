import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Space } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styles from './index.module.less';
interface Props {
	label: string;
	name: string;
	setOperator: (changeData: object) => void;
	value: any;
}
const SpecialCom = (props: Props) => {
	const { label, name, setOperator, value } = props;
	const [form] = Form.useForm();
	const operations = Form.useWatch(name, form);

	const defaultList =
		value && value.operations
			? value.operations
			: [
					{
						operatorType: undefined,
						value: undefined
					}
			  ];
	// 逻辑运算符处理
	const defaultSymbol =
		value && value.operationLinks ? value.operationLinks : [];

	const initForm = () => {
		form.setFieldsValue({
			[name]: defaultList
		});
	};

	useEffect(() => {
		initForm();
	}, []);

	const [operationLinks, setSymbol] = React.useState<string[]>(defaultSymbol);
	const [formRenderKey, setFormRenderKey] = useState(Date.now()); // 初始渲染键
	const handleReset = () => {
		setFormRenderKey(Date.now()); // 生成新的渲染键，强制重新渲染
	};

	const handleChange = (val: any, index: number) => {
		const newSymbol = operationLinks;
		newSymbol[index] = val;
		setSymbol(newSymbol);
	};

	// 传值
	useEffect(() => {
		setOperator({
			[name]: { operationLinks, operations, type: '2', key: name }
		});
	}, [operations, operationLinks]);

	return (
		<Form
			name="basic"
			labelCol={{ span: 4 }}
			wrapperCol={{ span: 20 }}
			style={{ maxWidth: 600 }}
			initialValues={{ remember: true }}
			autoComplete="off"
			form={form}
		>
			<Form.Item label={label}>
				<div className={styles['logical-main-box']}>
					{operations?.length > 1 ? (
						<div key={formRenderKey}>
							{operationLinks.map((item, index) => {
								return (
									<div
										key={index}
										className={`${index > 0 && styles['halfLogical']} ${
											styles['logical-left']
										}`}
									>
										<div className={styles['vertical-line']}></div>
										<div className={styles['left-logical-select']}>
											<Select
												defaultValue={item}
												style={{ width: 50 }}
												onChange={(e) => {
													handleChange(e, index);
												}}
												options={[
													{ value: '1', label: '且' },
													{ value: '2', label: '或' }
												]}
											/>
										</div>
									</div>
								);
							})}
						</div>
					) : null}
					<div className={styles['logical-right']}>
						<Form.List name={name}>
							{(fields, { add, remove }) => (
								<>
									{fields.map(({ key, name, ...restField }, index) => (
										<Space
											key={key}
											style={{ display: 'flex', marginBottom: 8 }}
											align="baseline"
										>
											<Form.Item
												{...restField}
												name={[name, 'operatorType']}
												rules={[
													{ required: true, message: 'Missing first name' }
												]}
											>
												<Select
													style={{ width: 100 }}
													options={[
														{ value: '1', label: '大于' },
														{ value: '2', label: '小于' }
													]}
												/>
											</Form.Item>
											<Form.Item
												{...restField}
												name={[name, 'value']}
												rules={[{ required: true, message: '' }]}
											>
												<Input placeholder="" style={{ width: 100 }} />
											</Form.Item>
											{index == operations.length - 1 ? (
												<PlusCircleOutlined
													onClick={() => {
														add();
														setSymbol(operationLinks.concat(['1']));
													}}
												/>
											) : (
												<MinusCircleOutlined
													onClick={() => {
														remove(name);
														operationLinks.splice(index, 1);
														setSymbol(operationLinks);
														handleReset();
													}}
												/>
											)}
											{/* {index == 0 ? (
												operations.length > 1 ? (
													''
												) : (
													<PlusCircleOutlined onClick={() => add()} />
												)
											) : (
												<MinusCircleOutlined onClick={() => remove(name)} />
											)} */}
										</Space>
									))}
								</>
							)}
						</Form.List>
					</div>
				</div>
			</Form.Item>
		</Form>
	);
};

export default SpecialCom;
