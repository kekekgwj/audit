import CustomDialog from '@/components/custom-dialog';
import { Form, Input } from 'antd';
import { useEffect } from 'react';

import { getSql } from '@/api/dataAnalysis/sql';

const { TextArea } = Input;

interface Props {
	open: boolean;
	defaultValue: any;
	cancel: () => void;
}

export default (props: Props) => {
	const { open, defaultValue, cancel } = props;
	const [form] = Form.useForm();

	useEffect(() => {
		if (open) {
			// form.setFieldsValue(defaultValue);
			getInfo();
		}
	}, [open]);

	const getInfo = async () => {
		const res = await getSql(defaultValue.key);
		form.setFieldsValue({
			sqlName: res.name,
			sqlContent: res.sql
		});
	};

	return (
		<div>
			<CustomDialog
				open={open}
				title="查看"
				width={450}
				showOkButton={false}
				showCancelButton={false}
				onCancel={cancel}
			>
				<Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
					<Form.Item name="sqlName" label="SQL名称">
						<Input placeholder="请输入" disabled />
					</Form.Item>
					<Form.Item name="sqlContent" label="SQL内容">
						<TextArea rows={4} placeholder="请输入" disabled />
					</Form.Item>
				</Form>
			</CustomDialog>
		</div>
	);
};
