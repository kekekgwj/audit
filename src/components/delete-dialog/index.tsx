import React from 'react';
import { Button, Modal, Space } from 'antd';
import {
	CloseCircleOutlined,
	ExclamationCircleOutlined
} from '@ant-design/icons';
import SvgIcon from '@/components/svg-icon';
import styles from './index.module.less';

interface DialogProps {
	open: boolean; // 是否打开模态框
	width?: string | number; // 模态框宽度
	wrapClassName?: string; // 模态框外层节点class名
	handleCancle?: (...args: any[]) => any; // 取消按钮事件
	onOk?: (...args: any[]) => any; // 确认按钮事件
}

export default (props: DialogProps) => {
	const { open, width = 420, wrapClassName, handleCancle, onOk } = props;
	return (
		<Modal
			open={open}
			width={width}
			footer={false}
			wrapClassName={wrapClassName}
			closeIcon={<SvgIcon name="close" color="#24A36F"></SvgIcon>}
			onCancel={handleCancle}
			className={styles['custom-dialog']}
		>
			<div className={styles['ant-modal__main']}>
				<div className={styles['delete-icon-box']}>
					{/* <Space>
						<ExclamationCircleOutlined
							style={{ fontSize: '45px', color: '#F6AC2D' }}
						/>
					</Space> */}
					<SvgIcon name="warning"></SvgIcon>
				</div>
				<div className={styles['ant-modal-message']}>
					该条数据删除后将无法恢复，是否删除数据？
				</div>
			</div>
			<div className={styles['ant-modal__footer']}>
				<Button className={styles.cancel} onClick={handleCancle}>
					取消
				</Button>
				<Button type="primary" className={styles.submit} onClick={onOk}>
					确定
				</Button>
			</div>
		</Modal>
	);
};
