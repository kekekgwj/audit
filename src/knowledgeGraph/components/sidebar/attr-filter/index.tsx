import React, { useState, useEffect, useRef } from 'react';
import { Button, Tree } from 'antd';
import CustomDialog from '@graph/components/custom-dialog';
import { DataNode } from 'antd/es/tree';
import { CaretDownOutlined } from '@ant-design/icons';
import SvgIcon from '@graph/components/svg-icon';
import FillterAttr from './fillterAttr';
import styles from './index.module.less';
import { chownSync } from 'fs';

import { getNextPaths } from '@/api/knowledgeGraph/graphin';
import Item from 'antd/es/list/Item';

interface Props {
	data: object;
}
interface treeDataNode {
	title: string;
	key: string;
	children?: treeDataNode[];
	isLeaf?: boolean;
	path: string[];
	properties?: any[];
}
export default (props: Props) => {
	const [dataList, setDataList] = useState([
		// {
		// 	title: 'parent 1-0',
		// 	key: '0-0-0',
		// 	type: 'input1',
		// 	children: [
		// 		{
		// 			title: 'leaf',
		// 			key: '0-0-0-0',
		// 			type: 'input2'
		// 		},
		// 		{
		// 			title: 'leaf',
		// 			key: '0-0-0-1',
		// 			type: 'input1'
		// 		},
		// 		{
		// 			title: 'leaf',
		// 			key: '0-0-0-2',
		// 			type: 'input3'
		// 		}
		// 	]
		// },
		// {
		// 	title: 'parent 1-1',
		// 	key: '0-0-1',
		// 	type: 'input1',
		// 	children: [
		// 		{
		// 			title: 'leaf',
		// 			key: '0-0-1-0',
		// 			type: 'input2'
		// 		}
		// 	]
		// },
		// {
		// 	title: 'parent 1-2',
		// 	key: '0-0-2',
		// 	type: 'input3',
		// 	children: [
		// 		{
		// 			title: 'leaf',
		// 			key: '0-0-2-0',
		// 			type: 'input1'
		// 		},
		// 		{
		// 			title: 'leaf',
		// 			key: '0-0-2-1',
		// 			type: 'input1'
		// 		}
		// 	]
		// }
	]);

	const [options, setOptions] = useState([]);
	const fillterAttrRef = useRef();
	const [clickData, setClickData] = useState<{ fromType: string; key: string }>(
		{ fromType: '', key: '' }
	);
	const [open, setOpen] = useState(false);
	const [saveNodes, setSaveNodes] = useState<string[]>(); //需要保存的节点内容
	const { data } = props;

	const [treeData, setTreeData] = useState<treeDataNode[]>(); //树结构渲染用的数据

	// 打开/关闭设置弹框
	const changeDialogOpen = (isOpen = true) => {
		setOpen(isOpen);
		if (isOpen) {
			getNextPaths({
				nodeFilter: [],
				parentPaths: [],
				type: 'Company',
				value: '07225997'
			}).then((res) => {
				console.log(res, 101);
				res.forEach((item) => {
					item.path = [];
				});
				// 设表单初始值
				setOptions(res[0].properties);
				setTreeData(changeDataTree(res));
			});
		}
	};
	//把原始数据改成dataTree能用的数据
	const changeDataTree = (list: any[]) => {
		return list.map((item) => {
			console.log(item.path);
			return {
				path: [...item.path, item.name],
				title: item.name,
				key: new Date().getTime() + item.name,
				children: [],
				isLeaf: false,
				properties: item.properties
			};
		});
	};

	//	展开节点 加载数据
	const onLoadData = (node: any) =>
		new Promise<void>((resolve) => {
			if (node.children?.length > 0) {
				resolve();
				return;
			}
			console.log(node, 124124124);
			getNextPaths({
				nodeFilter: [],
				parentPaths: node.path,
				type: 'Company',
				value: '07225997'
			}).then((res) => {
				res.forEach((item) => {
					item.path = node.path;
				});
				setTreeData((origin) =>
					updateTreeData(origin, node.key, changeDataTree(res))
				);
				resolve();
			});
		});

	const updateTreeData = (
		list: DataNode[],
		key: React.Key,
		children: DataNode[]
	): DataNode[] =>
		list.map((node) => {
			if (node.key === key) {
				return {
					...node,
					children
				};
			}
			if (node.children) {
				return {
					...node,
					children: updateTreeData(node.children, key, children)
				};
			}
			return node;
		});

	// 点击确定
	const handleOk = () => {
		console.log('ok', saveNodes);
		//通过需要保存的节点去筛选原数组
		if (saveNodes) {
			const newData: any[] = [];
			saveNodes.forEach((res) => {
				newData.push(findNodeItem(res, dataList));
			});
			console.log('最终提交的数据：', newData);
		}
	};
	//通过key查找node节点
	const findNodeItem = (key: string, dataList: any[]): any | undefined => {
		for (const item of dataList) {
			if (item.key === key) {
				return item;
			}
			if (item.children) {
				const child = findNodeItem(key, item.children);
				if (child) {
					return child;
				}
			}
		}
		return undefined;
	};

	// 关闭设置弹框
	const handleCancel = () => {
		changeDialogOpen(false);
	};

	// 自定义树形节点
	const customTreeTitle = (nodeData: DataNode) => {
		return (
			<div className={styles['fillter-tree-title']}>
				<SvgIcon name="line"></SvgIcon>
				<div>{nodeData.title}</div>
			</div>
		);
	};

	//点击复选框触发筛选出确认保存的节点
	const checkedNodes = (checkedKeys: any, e: any) => {
		setSaveNodes(checkedKeys.checked);
	};

	//点击树节点触发
	const selectNodes = (checkedKeys: any, e: any) => {
		console.log(checkedKeys, e);
		setOptions(e.node.properties);
		// setClickData({
		// 	fromType: e.node.type,
		// 	key: e.node.key
		// });

		//重置并设置默认值
		// fillterAttrRef.current && fillterAttrRef.current.form.resetFields();
		// const defaultValue = findNodeItem(e.node.key, dataList).value;
		// if (defaultValue) {
		// 	for (let key in defaultValue) {
		// 		fillterAttrRef.current &&
		// 			fillterAttrRef.current.form.setFieldValue(key, defaultValue[key]);
		// 	}
		// }
	};
	//右边表单改变时触发
	const onFromChange = (res: any) => {
		console.log(res);
		//改变原数组中的值
		setDataList(findTreeItemByKey(clickData.key, dataList, res));
	};

	//添加对应node节点中的数据
	const findTreeItemByKey = (
		key: string,
		list: any[],
		data: any
	): any | undefined => {
		return list.map((res) => {
			if (res.children) {
				res.children = findTreeItemByKey(key, res.children, data); // 递归调用changeDataTree，并将返回的新数据列表赋值给res.children
			}
			if (res.key == key) {
				return { ...res, value: data };
			} else {
				return res;
			}
		});
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
							onCheck={checkedNodes}
							onSelect={selectNodes}
							loadData={onLoadData}
						/>
					</div>
					<div className={styles['fillter-attr']}>
						<FillterAttr
							ref={fillterAttrRef}
							fromChange={onFromChange}
							properties={options}
						></FillterAttr>
					</div>
				</div>
				{/* <FillterBox title="测试"></FillterBox> */}
			</CustomDialog>
		</>
	);
};
