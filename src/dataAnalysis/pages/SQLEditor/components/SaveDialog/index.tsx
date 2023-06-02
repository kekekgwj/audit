import CustomDialog from '@/components/custom-dialog';
import { Form, Input } from 'antd';
import { useEffect } from 'react';

const { TextArea } = Input;

interface Props {
	open: boolean;
	defaultValue: any;
	cancel: () => void;
	submit: (form: any) => void;
}

export default (props: Props) => {
	const { open, defaultValue, submit, cancel } = props;
	const [form] = Form.useForm();

	useEffect(() => {
		if (open) {
			form.setFieldsValue(defaultValue);
		}
	}, [open]);

	const handleOk = () => {
		submit(form.getFieldsValue());
	};

	return (
		<div>
			<CustomDialog
				open={open}
				title="保存SQL"
				width={450}
				onOk={handleOk}
				onCancel={cancel}
			>
				<Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
					<Form.Item name="sqlName" label="命名为">
						<Input placeholder="请输入" />
					</Form.Item>
				</Form>
			</CustomDialog>
		</div>
	);
};
