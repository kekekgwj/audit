import React, { useState } from 'react';
import CustomDialog from '@/components/custom-dialog';

interface Props {
	open: boolean;
	handleCancel: () => void;
}

const AddCom = React.memo((props: Props) => {
	const { open, handleCancel } = props;
	const handleOk = () => {};
	return (
		<div>
			<CustomDialog
				open={open}
				title="新增"
				width={600}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<div>这里是内容</div>
			</CustomDialog>
		</div>
	);
});

export default AddCom;
