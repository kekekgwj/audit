import React, { useState, useImperativeHandle, useEffect } from 'react';
import CustomDialog from '@/components/custom-dialog';
import styles from './dialog.module.less';
import {
	Space,
	Pagination,
	Form,
	Input,
	Button,
	Select,
	message,
	Upload,
	Radio
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
interface Props {
	open: boolean;
	cRef: any;
	handleCancel: () => void;
	refresh: () => void;
	setOpenImport: (open: boolean) => void;
}
const { TextArea } = Input;
import { importTable } from '@/api/dataAnalysis/dataManage.ts';
const ImportCom = React.memo((props: Props) => {
	const [form] = Form.useForm();
	const [overLimit, setOverLimit] = React.useState(false);
	const { open, cRef, handleCancel, refresh, setOpenImport } = props;
	const type = Form.useWatch('type', form);

	useImperativeHandle(cRef, () => ({
		resetForm: () => {
			form.resetFields();
		}
	}));

	useEffect(() => {
		initForm();
	}, [open]);

	const initForm = () => {
		form.setFieldValue('type', 'EXCEL');
	};

	const optionsType = [
		{
			label: '表格文件',
			value: 'EXCEL'
		},
		{
			label: '数据库备份文件',
			value: 'SQL'
		}
	];
	const changeType = (e: Event) => {
		form.setFieldValue('type', e.target.value);
	};

	const normFile = (e: any) => {
		console.log(e, 565656);
		return e.fileList[0];
	};

	const handleOk = () => {
		const data = form.getFieldsValue();
		if (overLimit) {
			return false;
		}
		form.validateFields().then(() => {
			const formData = new FormData();
			formData.append('type', data.type);
			formData.append('tableName', data.tableName);
			formData.append('file', data.file.originFileObj);
			formData.append('description', data.description);
			importTable(formData)
				.then((res) => {
					message.success('导入成功');
					setOpenImport(false);
					form.resetFields();
					refresh();
				})
				.catch((err) => {
					console.log(err);
				});
		});
	};

	const beforeUpload = (file: any) => {
		console.log(file.size, 787878);
		const isFile200M = file.size / 1024 / 1024 > 200;
		if (isFile200M) {
			message.error('文件大小超出限制，请修改后重新上传');
			setOverLimit(true);
			return false;
		} else {
			setOverLimit(false);
			return false;
		}
	};

	const showInfo = () => {
		if (type == 'EXCEL') {
			return (
				<div className={styles['tip-box']}>
					<p>说明：1、支持表格文件格式：excel；</p>
					<p>2、文件大小限制：不超过200M；</p>
					<p>
						3、表格第一行必须为中文列名，不支持多级标题，不支持处理超过1个sheet的excel文件；
					</p>
				</div>
			);
		} else {
			return (
				<div className={styles['tip-box']}>
					<p>说明：1、支持表格文件格式：SQL；</p>
					<p>2、文件大小限制：不超过200M；</p>
				</div>
			);
		}
	};

	return (
		<div>
			<CustomDialog
				open={open}
				title="导入数据"
				width={600}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<Form
					form={form}
					labelCol={{ span: 4 }}
					wrapperCol={{ span: 20 }}
					labelAlign="left"
				>
					<Form.Item label="数据类型" name="type">
						<Radio.Group
							options={optionsType}
							optionType="button"
							buttonStyle="solid"
							value={type}
							onChange={changeType}
						/>
						{type && showInfo()}
					</Form.Item>
					<Form.Item
						label="导入文件"
						name="file"
						getValueFromEvent={normFile}
						rules={[{ required: true, message: '请选择文件' }]}
					>
						{type == 'EXCEL' ? (
							<Upload
								maxCount={1}
								accept=".xls,.xlsx"
								beforeUpload={beforeUpload}
							>
								<Button icon={<UploadOutlined />}>选择文件</Button>
							</Upload>
						) : (
							<Upload maxCount={1} accept=".sql" beforeUpload={beforeUpload}>
								<Button icon={<UploadOutlined />}>选择文件</Button>
							</Upload>
						)}
					</Form.Item>
					<Form.Item
						label="表名称"
						name="tableName"
						rules={[{ required: true, message: '请输入名称' }]}
					>
						<Input placeholder="请输入" />
					</Form.Item>
					<Form.Item label="描述" name="description">
						<TextArea placeholder="请输入" rows={2} />
					</Form.Item>
				</Form>
			</CustomDialog>
		</div>
	);
});

export default ImportCom;
