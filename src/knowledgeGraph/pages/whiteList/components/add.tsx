import React, { useState, useImperativeHandle, useEffect } from 'react';
import CustomDialog from '@graph/components/custom-dialog';
import { Space, Pagination, Form, Input, Button, Select, message } from 'antd';
import {
	getPrimaryProperties,
	saveWhiteList
} from '@/api/knowledgeGraph/whiteList';

interface Props {
	open: boolean;
	id: string;
	handleCancel: () => void;
	listType: []; //类型
	cRef: any;
	refresh: () => void;
}

const AddCom = React.memo((props: Props) => {
	const [messageApi, contextHolder] = message.useMessage();
	const [form] = Form.useForm();
	const { open, handleCancel, cRef, listType, refresh } = props;
	const type = Form.useWatch('type', form);
	const [formArr, setFormArr] = React.useState([]);

	useEffect(() => {
		if (type) {
			//根据类型获取需要渲染表单项
			getPrimaryProperties({ type }).then((res) => {
				setFormArr(res);
			});
		} else {
			setFormArr([]);
		}
	}, [type]);

	useImperativeHandle(cRef, () => ({
		resetForm: () => {
			form.resetFields();
		}
	}));

	// 提交表单
	const handleOk = () => {
		const formdata = form.getFieldsValue();
		delete formdata.type;
		console.log(formdata, 15151555555);
		const data = {
			type,
			propertyJson: formdata
		};
		console.log(data, 466666);
		saveWhiteList(data).then((res) => {
			console.log('ok', 511111);
			messageApi.open({
				type: 'success',
				content: '新增成功'
			});
			handleCancel(); //关闭弹窗
			refresh();
		});
	};

	// 根据类型渲染的表单项
	const renderItem = () => {
		return (
			<>
				{formArr.map((item) => (
					<Form.Item key={item.key} label={item.label} name={item.key}>
						<Input />
					</Form.Item>
				))}
			</>
		);
	};
	const onmainTypeChange = () => {};

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
						<Select
							placeholder="请选择"
							onChange={onmainTypeChange}
							options={listType}
							allowClear
						></Select>
					</Form.Item>
					{formArr && formArr.length > 0 && renderItem()}
				</Form>
			</CustomDialog>
		</div>
	);
});

export default AddCom;
