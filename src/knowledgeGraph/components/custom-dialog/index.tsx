import React from 'react';
import { Button, Modal } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import styles from './index.module.less';

interface DialogProps {
	open: boolean; // 是否打开模态框
	title?: string; // 模态框标题
	width?: string | number; // 模态框宽度
	wrapClassName?: string; // 模态框外层节点class名
	children?: React.ReactNode; // 自节点
	onOk?: (...args: any[]) => any; // 确定按钮事件
	onCancel?: (...args: any[]) => any; // 取消按钮事件
}

export default (props: DialogProps) => {
	const {
		open,
		title,
		width = 420,
		wrapClassName,
		children,
		onOk,
		onCancel
	} = props;
	// const customClassName = `${wrapClassName || ''} custom-dialog`;
	return (
		<Modal
			open={open}
			width={width}
			footer={false}
			wrapClassName={wrapClassName}
			closeIcon={<CloseCircleOutlined />}
			onCancel={onCancel}
			className={styles['custom-dialog']}
		>
			<div className={styles['ant-modal__header']}>
				<div className={styles['ant-modal__header_title']}>{title}</div>
			</div>
			<div className={styles['ant-modal__main']}>{children}</div>
			<div className={styles['ant-modal__footer']}>
				<Button className={styles.cancel} onClick={onCancel}>
					取消
				</Button>
				<Button type="primary" className={styles.submit} onClick={onOk}>
					确定
				</Button>
			</div>
		</Modal>
	);
};
