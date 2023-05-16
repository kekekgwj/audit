import React, { useState, useRef } from 'react';
import { Button, Tree, message } from 'antd';
import CustomDialog from '@graph/components/custom-dialog';
import { CaretDownOutlined } from '@ant-design/icons';
import FillterAttr, { ComponentsType } from './fillterAttr';
import SvgIcon from '@/components/svg-icon';
import styles from './index.module.less';

import { IPath, IProperty, getNextPaths } from '@/api/knowledgeGraph/graphin';
import { FormItems } from '../sideBar';

interface IResProperty {
	key: string;
	label: string;
	type: string;
}
export interface INextPathResponse {
	name: string;
	path?: string[];
	properties: IResProperty[];
}

// 处理过的TreeData
interface ITreeData {
	path: string[];
	title: string;
	key: string;
	children: ITreeData[];
	isLeaf: boolean;
	properties: IResProperty[];
}
interface IConfigInfo {
	value: unknown;
	type: ComponentsType;
	key: string;
}
export interface INodeConfigNProps {
	properties: IResProperty[];
	configInfo: IConfigInfo | Record<string, never>;
}
interface IProps {
	getFormItemValue: (name: FormItems) => any;
	setFormItemValue: (name: FormItems, value: any) => any;
	updateGraph: (paths: IPath[]) => void;
}
export default (props: IProps) => {
	const { getFormItemValue, setFormItemValue, updateGraph } = props;
	const fillterAttrRef = useRef(null);
	const [open, setOpen] = useState(false);
	const [saveNodes, setSaveNodes] = useState<string[]>([]); //需要保存的节点内容
	const [treeData, setTreeData] = useState<ITreeData[]>([]); //树结构渲染用的数据

	const nodeConfigNProperties = useRef(new Map<string, INodeConfigNProps>());

	const [selectNodeID, setSelectedNodeID] = useState<string | null>(null);
	const nodeFilter = getFormItemValue(FormItems.bodyFilter);
	const curNode: {
		bodyType: string;
		bodyName: string;
	}[] = getFormItemValue(FormItems.bodys);
	let curNodeType: string | undefined, curNodeVaule: string | undefined;
	if (
		curNode &&
		Array.isArray(curNode) &&
		curNode[0].bodyName &&
		curNode[0].bodyType
	) {
		curNodeType = curNode[0].bodyType as string;
		curNodeVaule = curNode[0].bodyName as string;
	}
	// 打开/关闭设置弹框
	const changeDialogOpen = async (isOpen = true) => {
		setOpen(isOpen);
		if (!isOpen) {
			return;
		}
		try {
			if (!curNodeType || !curNodeVaule) {
				message.error('未选择主体');
				return;
			}
			const res = await getNextPaths({
				nodeFilter,
				parentPaths: [],
				type: curNodeType,
				value: curNodeVaule
			});

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
		const { bodyType = null, bodyName = null } =
			getFormItemValue(FormItems.bodys) &&
			Array.isArray(getFormItemValue(FormItems.bodys))
				? getFormItemValue(FormItems.bodys)[0]
				: {};
		if (!bodyName || !bodyType) {
			message.error('未选择主体');
			return;
		}
		if (node.children?.length > 0) {
			return Promise.resolve();
		}
		try {
			const res = await getNextPaths({
				nodeFilter,
				parentPaths: node.path,
				type: bodyType,
				value: bodyName
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
	const handleOk = async () => {
		const configData = transData(treeData);

		updateGraph(configData);
	};
	const getNodeDataConverted = (id: string): IProperty[] => {
		const rawData = nodeConfigNProperties.current.get(id)?.configInfo || {};

		const convertProperties = Object.entries(rawData).map(([label, v]) => {
			if (!saveNodes.includes(id)) {
				return {};
			}
			const { value, type, key } = v;

			const formatValue: Pick<IProperty, 'operationLinks' | 'operations'> = {
				operationLinks: [],
				operations: []
			};
			if (type === ComponentsType.PERSON) {
				value.forEach((person: string, index: number) => {
					if (index > 0) {
						formatValue.operationLinks.push(2);
					}
					formatValue.operations.push({
						operatorType: 1,
						value: person
					});
				});
			}

			if (type === ComponentsType.DATE) {
				const [start, end] = value;
				formatValue.operations.push({
					// >=
					operatorType: 3,
					value: start
				});
				formatValue.operations.push({
					// <=
					operatorType: 5,
					value: end
				});
			}

			if (type === ComponentsType.GENDER) {
				formatValue.operations.push({
					operatorType: 1,
					value: value
				});
			}

			if (type === ComponentsType.RANGE) {
				formatValue.operationLinks = value?.operationLinks || [];
				formatValue.operations = value?.operations || [];
			}
			if (
				formatValue.operationLinks.length === 0 &&
				formatValue.operations.length === 0
			) {
				return null;
			}
			return {
				key,
				type: Number(type),
				...formatValue
			};
		});
		return convertProperties.filter((p) => p !== null) as IProperty[];
	};

	//转成后台需要的数据形式
	const transData = (list: ITreeData[]): IPath[] => {
		return list.map((item: ITreeData) => {
			return {
				name: item.title,
				nextPaths: transData(item.children),
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
	};

	return (
		<>
			<Button onClick={() => changeDialogOpen(true)}>点我</Button>
			<CustomDialog
				open={open}
				title="链路筛选"
				width={600}
				height={400}
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
