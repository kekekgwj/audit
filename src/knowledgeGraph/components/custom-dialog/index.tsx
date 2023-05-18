import React, { useMemo } from 'react';
import { Button, Modal } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import styles from './index.module.less';

interface DialogProps {
	open: boolean; // 是否打开模态框
	title?: string; // 模态框标题
	minWidth?: string; // 最小宽度
	width?: string | number; // 模态框宽度
	height?: string | number; // 模态框内容区域高度
	wrapClassName?: string; // 模态框外层节点class名
	children?: React.ReactNode; // 自节点
	onOk?: (...args: any[]) => any; // 确定按钮事件
	onCancel?: (...args: any[]) => any; // 取消按钮事件
}

export default (props: DialogProps) => {
	const {
		open,
		title,
		width,
		minWidth,
		height,
		wrapClassName,
		children,
		onOk,
		onCancel,
	} = props;
	// const customClassName = `${wrapClassName || ''} custom-dialog`;

	const mainStyles = useMemo(() => {
		if (height) {
			return {
				height: height + 'px',
				scrollY: 'auto'
			};
		} else {
			return {
				height: 'auto'
			};
		}
	}, [height]);

	return (
		<Modal
			open={open}
			width={width}
			style={{minWidth: minWidth}}
			footer={false}
			wrapClassName={wrapClassName}
			closeIcon={<CloseCircleOutlined />}
			onCancel={onCancel}
			className={styles['custom-dialog']}
		>
			<div className={styles['ant-modal__header']}>
				<div className={styles['ant-modal__header_title']}>{title}</div>
			</div>
			<div style={mainStyles} className={styles['ant-modal__main']}>
				{children}
			</div>
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
