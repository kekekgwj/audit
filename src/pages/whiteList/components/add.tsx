import React, { useState, useImperativeHandle } from 'react';
import CustomDialog from '@/components/custom-dialog';
import { Space, Pagination, Form, Input, Button, Select } from 'antd';

interface Props {
	open: boolean;
	id: string;
	handleCancel: () => void;
	cRef;
}

const AddCom = React.memo((props: Props) => {
	const [form] = Form.useForm();
	const { open, handleCancel, cRef } = props;
	const type = Form.useWatch('type', form);

	useImperativeHandle(cRef, () => ({
		resetForm: () => {
			form.resetFields();
		}
	}));

	const arr = [
		{
			label: '姓名',
			value: 'name',
			data: '小明'
		},
		{
			label: '工号',
			value: 'workId',
			data: '18'
		},
		{
			label: '身份证号',
			value: 'idCard',
			data: '123456789112222'
		}
	];

	// 提交表单
	const handleOk = () => {
		const data = form.getFieldsValue();
		console.log(data, 15151555555);
	};

	// 根据类型 后台获取需要渲染的表单项
	const renderItem = () => {
		if (type == '1') {
			return (
				<>
					{arr.map((item) => (
						<Form.Item key={item.value} label={item.label} name={item.value}>
							<Input />
						</Form.Item>
					))}
				</>
			);
		} else if (type == '2') {
			return (
				<>
					<Form.Item label="名称" name="proName">
						<Input />
					</Form.Item>
				</>
			);
		} else {
			return null;
		}
	};
	const onmainTypeChange = (val) => {
		console.log(val);
	};

	return (
		<div>
			<CustomDialog
				open={open}
				title="新增"
				width={600}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
					<Form.Item name="type" label="类型">
						<Select placeholder="请选择" onChange={onmainTypeChange} allowClear>
							<Select.Option value="1">人</Select.Option>
							<Select.Option value="2">法人</Select.Option>
						</Select>
					</Form.Item>
					{renderItem()}
				</Form>
			</CustomDialog>
		</div>
	);
});

export default AddCom;
