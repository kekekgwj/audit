import React, { useState, useRef } from 'react';
import { Button, Tree } from 'antd';
import CustomDialog from '@graph/components/custom-dialog';
import { CaretDownOutlined } from '@ant-design/icons';
import SvgIcon from '@graph/components/svg-icon';
import FillterAttr from './fillterAttr';
import styles from './index.module.less';

import { getNextPaths } from '@/api/knowledgeGraph/graphin';
import { listenerCancelled } from '@reduxjs/toolkit/dist/listenerMiddleware/exceptions';
import { format } from 'url';

interface IProperty {
	key: string;
	label: string;
	type: number;
}
export interface INextPathResponse {
	name: string;
	path?: string[];
	properties: IProperty[];
}

// 处理过的TreeData
interface ITreeData {
	path: string[];
	title: string;
	key: string;
	children: ITreeData[];
	isLeaf: boolean;
	properties: IProperty[];
}
export interface INodeConfigNProps {
	properties: IProperty[];
	configInfo: any;
}
export default () => {
	const fillterAttrRef = useRef(null);
	const [open, setOpen] = useState(false);
	const [saveNodes, setSaveNodes] = useState<string[]>([]); //需要保存的节点内容
	const [treeData, setTreeData] = useState<ITreeData[]>([]); //树结构渲染用的数据

	const nodeConfigNProperties = useRef(new Map<string, INodeConfigNProps>());

	const [selectNodeID, setSelectedNodeID] = useState<string | null>(null);
	// 打开/关闭设置弹框
	const changeDialogOpen = async (isOpen = true) => {
		setOpen(isOpen);
		if (!isOpen) {
			return;
		}
		try {
			// todo: context -> nodeFilter & parentPaths
			const res = await getNextPaths({
				nodeFilter: [],
				parentPaths: [],
				type: 'Company',
				value: '07225997'
			});

			// 自己添加
			res[0].properties = [
				...res[0].properties,
				{
					key: 'range',
					label: '范围',
					value: null,
					type: 2
				}
			];

			setTreeData(changeDataTree(res));
		} catch (e) {
			console.error(e);
		}
		// 设表单初始值
	};
	//把原始数据改成dataTree能用的数据
	const changeDataTree = (list: INextPathResponse[]): ITreeData[] => {
		return list.map((item) => {
			const key = new Date().getTime() + item.name;
			const properties = item.properties;
			nodeConfigNProperties.current.set(key, {
				properties,
				configInfo: {}
			});

			return {
				path: item.path ? [...item.path, item.name] : [item.name],
				title: item.name,
				key,
				children: [],
				isLeaf: false,
				properties
			};
		});
	};

	//	展开节点 加载数据
	const onLoadData = async (node: ITreeData) => {
		// 已经加载子节点
		if (node.children?.length > 0) {
			return Promise.resolve();
		}
		try {
			const res = await getNextPaths({
				nodeFilter: [],
				parentPaths: node.path,
				type: 'Company',
				value: '07225997'
			});

			const nodesWithPath = res.map((item) => {
				return {
					...item,
					// 父节点path
					path: node.path
				};
			});

			const childrenTreeNode = changeDataTree(nodesWithPath);

			setTreeData((treeData) =>
				updateTreeData(treeData, node.key, childrenTreeNode)
			);

			return Promise.resolve();
		} catch (e) {
			return Promise.reject();
		}
	};

	const updateTreeData = (
		list: ITreeData[],
		key: React.Key,
		children: ITreeData[]
	): ITreeData[] =>
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
		//通过需要保存的节点去筛选原数组
		if (saveNodes) {
			// 转换数据形式 通过id在树形数据中查找对应位置
			console.log('树形数据', treeData);
			// 根据树数据,生成提交数据形式
			const configData = transData(treeData);
			console.log(configData, 168168);
			console.log('最终提交的数据：', configData);
		}
	};
	const getNodeDataConverted = (id: string) => {
		const rawDta = nodeConfigNProperties.current.get(id)?.configInfo;
		if (saveNodes.includes(id)) {
			return rawDta;
		} else {
			return null;
		}
	};
	//转成后台需要的数据形式
	const transData = (list: any) => {
		// console.log(list, 174174);
		return list.map((item) => {
			return {
				name: item.title,
				nextPath: transData(item.children),
				key: item.key,
				properties: getNodeDataConverted(item.key)
			};
		});
	};

	// 关闭设置弹框
	const handleCancel = () => {
		changeDialogOpen(false);
	};

	// 自定义树形节点
	const customTreeTitle = (nodeData: ITreeData) => {
		return (
			<div className={styles['fillter-tree-title']}>
				<SvgIcon name="line"></SvgIcon>
				<div>{nodeData.title}</div>
			</div>
		);
	};

	//点击复选框触发筛选出确认保存的节点
	const checkedNodes = (checkedKeys: any) => {
		setSaveNodes(checkedKeys.checked);
	};

	//点击树节点触发
	const selectNodes = (
		checkedKeys: any,
		{ selected, node }: { selected: boolean; node: ITreeData }
	) => {
		// todo: selected反选
		setSelectedNodeID(node.key);
		// setOptions(node.properties);
		// setClickData({
		// 	fromType: e.node.type,
		// 	key: e.node.key
		// });
		// 重置
		fillterAttrRef.current && fillterAttrRef.current.form.resetFields();
	};
	//右边表单改变时触发
	const onFormChange = (key: string, formAllValues: any) => {
		const curValues = nodeConfigNProperties.current.get(
			key
		) as INodeConfigNProps;
		nodeConfigNProperties.current.set(key, {
			...curValues,
			configInfo: formAllValues
		});
		console.info('nodeConfigNProperties', nodeConfigNProperties.current);
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
						{selectNodeID &&
							nodeConfigNProperties.current.get(selectNodeID) !== undefined && (
								<FillterAttr
									key={selectNodeID}
									id={selectNodeID}
									ref={fillterAttrRef}
									formChange={onFormChange}
									initValues={
										nodeConfigNProperties.current.get(
											selectNodeID
										) as INodeConfigNProps
									}
								></FillterAttr>
							)}
					</div>
				</div>
			</CustomDialog>
		</>
	);
};
