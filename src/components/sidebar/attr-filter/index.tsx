import React, { useState } from 'react';
import { Button, Tree } from 'antd';
import CustomDialog from '@/components/custom-dialog';
import { DataNode } from 'antd/es/tree';
import { CaretDownOutlined } from '@ant-design/icons';
import SvgIcon from '@/components/svg-icon';
import FillterAttr from './fillterAttr';
import styles from './index.module.less';

interface Props {
	data: object;
}

export default (props: Props) => {
	const [open, setOpen] = useState(false);

	const { data } = props;

	const treeData: DataNode[] = [
		{
			title: 'parent 1-0',
			key: '0-0-0',
			children: [
				{
					title: 'leaf',
					key: '0-0-0-0'
				},
				{
					title: 'leaf',
					key: '0-0-0-1'
				},
				{
					title: 'leaf',
					key: '0-0-0-2'
				}
			]
		},
		{
			title: 'parent 1-1',
			key: '0-0-1',
			children: [
				{
					title: 'leaf',
					key: '0-0-1-0'
				}
			]
		},
		{
			title: 'parent 1-2',
			key: '0-0-2',
			children: [
				{
					title: 'leaf',
					key: '0-0-2-0'
				},
				{
					title: 'leaf',
					key: '0-0-2-1'
				}
			]
		}
	];

	// 打开/关闭设置弹框
	const changeDialogOpen = (isOpen = true) => {
		setOpen(isOpen);
	};

	// 点击确定
	const handleOk = () => {
		console.log('ok');
	};

	// 关闭设置弹框
	const handleCancel = () => {
		changeDialogOpen(false);
	};

	// 自定义树形节点
	const customTreeTitle = (nodeData: DataNode) => {
		console.log(nodeData);
		return (
			<div className={styles['fillter-tree-title']}>
				<SvgIcon name="line"></SvgIcon>
				<div>{nodeData.key}</div>
			</div>
		);
	};

	return (
		<>
			<Button onClick={() => changeDialogOpen(true)}>点我</Button>
			<CustomDialog
				open={open}
				title="链路筛选"
				width={600}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<div className={styles['fillter-dialog__top']}>
					<div className={styles['fillter-tree']}>
						<Tree
							checkable
							checkStrictly
							switcherIcon={<CaretDownOutlined />}
							titleRender={customTreeTitle}
							treeData={treeData}
						/>
					</div>
					<div className={styles['fillter-attr']}>
						<FillterAttr></FillterAttr>
					</div>
				</div>
				{/* <FillterBox title="测试"></FillterBox> */}
			</CustomDialog>
		</>
	);
};
