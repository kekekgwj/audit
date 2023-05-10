import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, Space, Divider } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styles from './index.module.less';
interface Props {
	label: string;
	ikey: string;
	initForm: () => void;
	setOperator: (target: any, data: any) => void;
}
const SpecialCom = (props: Props) => {
	const { label, ikey, setOperator } = props;
	const [form] = Form.useForm();
	const bodys = Form.useWatch(ikey, form);

	const initForm = () => {
		form.setFieldsValue({
			[ikey]: [
				{
					bodyType: undefined,
					bodyName: undefined
				}
			]
		});
	};

	useEffect(() => {
		initForm();
	}, []);

	// 逻辑运算符处理
	const [symbol, setSymbol] = React.useState<string[]>([]);
	const [formRenderKey, setFormRenderKey] = useState(Date.now()); // 初始渲染键
	const handleReset = () => {
		setFormRenderKey(Date.now()); // 生成新的渲染键，强制重新渲染
	};

	const handleChange = (val: any, index: number) => {
		const newSymbol = symbol;
		newSymbol[index] = val;
		setSymbol(newSymbol);
	};

	// 传值
	useEffect(() => {
		console.log(bodys, 38888888888);
		setOperator(ikey, { symbol, bodys });
	}, [bodys, symbol]);

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
					{bodys?.length > 1 ? (
						<div key={formRenderKey}>
							{symbol.map((item, index) => {
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
						<Form.List name={ikey}>
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
												name={[name, 'bodyType']}
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
												name={[name, 'bodyName']}
												rules={[{ required: true, message: '' }]}
											>
												<Input placeholder="" style={{ width: 100 }} />
											</Form.Item>
											{/* <MinusCircleOutlined onClick={() => remove(name)} /> */}
											{index == bodys.length - 1 ? (
												<PlusCircleOutlined
													onClick={() => {
														add();
														setSymbol(symbol.concat(['1']));
													}}
												/>
											) : (
												<MinusCircleOutlined
													onClick={() => {
														remove(name);
														symbol.splice(index, 1);
														setSymbol(symbol);
														handleReset();
													}}
												/>
											)}
											{/* {index == 0 ? (
												bodys.length > 1 ? (
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
