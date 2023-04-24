import React, { useState, useImperativeHandle, useEffect } from 'react';
import CustomDialog from '@/components/custom-dialog';
import { Space, Pagination, Form, Input, Button, Select } from 'antd';

interface EditProps {
	open: boolean;
	id: string;
	handleCancel: () => void;
	cRef;
}

export default (props: EditProps) => {
	const { id, open, handleCancel, cRef } = props;
	const [form] = Form.useForm();
	const type = Form.useWatch('type', form);

	// 根据id从后台获取数据和需要渲染的表单项
	const data1 = [
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

	const data2 = [
		{
			label: '名称',
			value: 'name',
			data: 'xxx公司'
		}
	];

	useEffect(() => {
		form.setFieldValue('type', '1');
	}, [open]);

	useEffect(() => {
		initForm();
	}, [type]);

	// 初始化表单
	const initForm = () => {
		const data = type == 1 ? data1 : data2;
		data.forEach((item) => {
			form.setFieldValue(item.value, item.data);
		});
	};

	// 提交表单
	const handleOk = () => {
		const data = form.getFieldsValue();
		console.log(data, 15151555555);
	};

	//渲染表单
	const renderItem = () => {
		const data = type == 1 ? data1 : data2;
		return (
			<>
				{data.map((item) => (
					<Form.Item key={item.value} label={item.label} name={item.value}>
						<Input />
					</Form.Item>
				))}
			</>
		);
	};

	useImperativeHandle(cRef, () => ({
		resetForm: () => {
			form.resetFields();
		}
	}));

	const onmainTypeChange = () => {};

	return (
		<div>
			<CustomDialog
				open={open}
				title="编辑"
				width={600}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
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
};
