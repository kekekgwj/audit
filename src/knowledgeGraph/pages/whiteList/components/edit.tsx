import React, { useState, useImperativeHandle, useEffect } from 'react';
import CustomDialog from '@/components/custom-dialog';
import { Space, Pagination, Form, Input, Button, Select, message } from 'antd';
import {
	getWhiteDetail,
	getPrimaryProperties,
	updateWhiteList
} from '@/api/knowLedgeGraph/whiteList';

interface EditProps {
	open: boolean;
	id: string;
	handleCancel: () => void;
	cRef: any;
	listType: []; //类型
	refresh: () => void;
}

export default (props: EditProps) => {
	const [messageApi, contextHolder] = message.useMessage();
	const { id, open, handleCancel, cRef, listType, refresh } = props;
	const [form] = Form.useForm();
	const type = Form.useWatch('type', form);
	const [originType, setOriginType] = useState(''); //原始类型
	const [originData, setOriginData] = useState([]); //原始数据表单
	const [formArr, setFormArr] = React.useState([]); //渲染表单项数据

	useEffect(() => {
		if (open) {
			getWhiteDetail({ whiteListId: id }).then((res) => {
				console.log(res, 202020);
				setOriginType(res.type);
				console.log(res.properties, 202020);
				setOriginData(res.properties);
				console.log(originData);
				setFormArr(res.properties);
			});
		}
	}, [open, id]);

	useEffect(() => {
		console.log(originData, 4141);
		initForm();
	}, [originData]);

	// 初始化表单  切换时也需要再次渲染
	const initForm = () => {
		console.log(originData, 8080);
		originData.forEach((item) => {
			form.setFieldValue(item.key, item.value);
		});
		form.setFieldValue('type', originType);
	};

	// 提交表单
	const handleOk = () => {
		const formdata = form.getFieldsValue();
		delete formdata.type;
		const data = {
			type,
			id,
			propertyJson: formdata
		};
		console.log(data, 466666);
		updateWhiteList(data).then((res) => {
			console.log('ok', 511111);
			messageApi.open({
				type: 'success',
				content: '编辑成功'
			});
			handleCancel(); //关闭弹窗
			refresh();
		});
	};

	//渲染表单
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

	useImperativeHandle(cRef, () => ({
		resetForm: () => {
			form.resetFields();
		}
	}));

	const onmainTypeChange = (val: string) => {
		getPrimaryProperties({ type: val }).then((res) => {
			setFormArr(res);
			if (val == originType) {
				//切回需要回显数据
				initForm();
			}
		});
	};

	return (
		<div>
			<CustomDialog
				open={open}
				title="编辑"
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
					{renderItem()}
				</Form>
			</CustomDialog>
			{contextHolder}
		</div>
	);
};
