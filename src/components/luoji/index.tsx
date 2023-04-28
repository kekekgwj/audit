import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Space, Divider } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styles from './index.module.less';
const SpecialCom = () => {
	const [form] = Form.useForm();
	const bodys = Form.useWatch('bodys', form);
	useEffect(() => {
		initForm();
	}, []);

	const bodyTypeOptions = [
		{ value: '001', label: '大于' },
		{ value: '002', label: '小于' }
	];

	const initForm = () => {
		form.setFieldsValue({
			bodys: [
				{
					bodyType: undefined,
					bodyName: undefined
				}
			],
			leval: 4
		});
	};

	const onFinish = () => {};

	return (
		<div className={styles['logical-main-box']}>
			{/* <div className="logical-left">且</div> */}
			{bodys?.length > 1 ? (
				<div className={styles['logical-left']}>
					<Divider type="vertical">11111111111111111</Divider>
				</div>
			) : null}
			<div className={styles['logical-right']}>
				<Form
					form={form}
					labelCol={{ span: 4 }}
					wrapperCol={{ span: 20 }}
					style={{ maxWidth: 600 }}
					initialValues={{ remember: true }}
					autoComplete="off"
				>
					<Form.List name="bodys">
						{(fields, { add, remove }) => (
							<>
								{fields.map((field, index) => (
									<Space key={field.key} align="baseline">
										<Form.Item
											noStyle
											shouldUpdate={(prevValues, curValues) =>
												prevValues.area !== curValues.area ||
												prevValues.sights !== curValues.sights
											}
										>
											{() => (
												<Form.Item
													{...field}
													name={[field.name, 'bodyType']}
													rules={[{ required: true, message: 'Missing sight' }]}
												>
													<Select
														style={{ width: 130 }}
														options={bodyTypeOptions}
													></Select>
												</Form.Item>
											)}
										</Form.Item>
										<Form.Item
											{...field}
											name={[field.name, 'bodyname']}
											rules={[{ required: true, message: 'Missing price' }]}
										>
											<Input />
										</Form.Item>
										{index == 0 ? (
											bodys.length > 1 ? (
												''
											) : (
												<PlusOutlined onClick={() => add()} />
											)
										) : (
											<MinusCircleOutlined onClick={() => remove(field.name)} />
										)}
									</Space>
								))}
							</>
						)}
					</Form.List>
				</Form>
			</div>
		</div>
	);
};

export default SpecialCom;
