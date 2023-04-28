import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Space, Divider } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';

import styles from './index.module.less';
interface Props {
	form;
	label: string;
	ikey: string;
	initForm: () => void;
}
const SpecialCom = (props: Props) => {
	const { form, label, ikey, initForm } = props;
	console.log(ikey, 1313131);
	const bodys = Form.useWatch(ikey, form);
	useEffect(() => {
		initForm({
			[ikey]: [
				{
					bodyType: undefined,
					bodyName: undefined
				}
			]
		});
	}, []);

	const handleChange = () => {};

	return (
		<Form.Item label={label}>
			<div className={styles['logical-main-box']}>
				{bodys?.length > 1 ? (
					<div className={styles['logical-left']}>
						<div className={styles['vertical-line']}></div>
						<div className={styles['left-logical-select']}>
							<Select
								defaultValue="1"
								style={{ width: 50 }}
								onChange={handleChange}
								options={[
									{ value: '1', label: '且' },
									{ value: '2', label: '或' }
								]}
							/>
						</div>
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
												defaultValue="1"
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
										{index == 0 ? (
											bodys.length > 1 ? (
												''
											) : (
												<PlusCircleOutlined onClick={() => add()} />
											)
										) : (
											<MinusCircleOutlined onClick={() => remove(name)} />
										)}
									</Space>
								))}
							</>
						)}
					</Form.List>
				</div>
			</div>
		</Form.Item>
	);
};

export default SpecialCom;
