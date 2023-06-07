import React, { useState, useRef, useEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { Button, Tree, message } from 'antd';
import CustomDialog from '@/components/custom-dialog';
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
	setCurPath: (paths: IPath[]) => void;
	canUse: boolean; //是否禁用
	curData: any; //当前图谱数据 没有禁止链路
}
export default (props: IProps) => {
	const {
		getFormItemValue,
		setFormItemValue,
		updateGraph,
		setCurPath,
		canUse,
		curData
	} = props;
	const fillterAttrRef = useRef(null);
	const [open, setOpen] = useState(false);
	const [saveNodes, setSaveNodes] = useState<string[]>([]); //需要保存的节点内容
	const [treeData, setTreeData] = useState<ITreeData[]>([]); //树结构渲染用的数据

	const nodeConfigNProperties = useRef(new Map<string, INodeConfigNProps>());
	const cntInitRef = useRef<boolean>(true);
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
	const changeDialogOpen = async () => {
		if (!curNodeType || !curNodeVaule) {
			message.error('未选择主体');
			return;
		}

		setOpen(true);
		try {
			// 避免数据被销毁
			if (!cntInitRef.current) return;
			const res = await getNextPaths({
				nodeFilter,
				parentPaths: [],
				type: curNodeType,
				value: curNodeVaule
			});

			setTreeData(changeDataTree(res));
			cntInitRef.current = false;
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
		console.log('treeData', configData, 184184);
		updateGraph(configData);
		setCurPath(configData); //当前选中链路数据
		setOpen(false);
	};
	const getNodeDataConverted = (id: string): IProperty[] => {
		const rawData = nodeConfigNProperties.current.get(id)?.configInfo || {};

		const convertProperties = Object.entries(rawData).map(([label, v]) => {
			if (!saveNodes.includes(id)) {
				return null;
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
	const getOnePath = (treeData: ITreeData[]): string => {
		if (treeData.length === 0) {
			return '请选择筛选条件';
		}
		const firstPath = treeData[0];
		if (firstPath.children && firstPath.children.length > 0) {
			return getOnePath(firstPath.children);
		} else {
			return firstPath.path.join('  ->  ') + '...';
		}
	};

	const ref = useRef(null);
	const [test, setTest] = useState<Array<number>>([]);
	const [width, setWidth] = useState(700);

	const handleTest = () => {
		console.log('test');
		const arr = [...test];
		arr.push(1);
		setTest(arr);
		setWidth(1000);
	};

	// useEffect(() => {
	// 	const ro = new ResizeObserver((entries, observer) => {
	// 		for (const entry of entries) {
	// 			const { left, top, width, height } = entry.contentRect;

	// 			console.log('Element:', entry.target);
	// 			console.log(`Element's size: ${width}px x ${height}px`);
	// 			console.log(`Element's paddings: ${top}px ; ${left}px`);
	// 		}
	// 	});
	// 	ro.observe(document.getElementById('app'));
	// }, []);

	return (
		<>
			<Button
				disabled={canUse || !curData}
				onClick={() => changeDialogOpen()}
				style={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}
			>
				{getOnePath(treeData)}
			</Button>
			<CustomDialog
				open={open}
				title="链路筛选"
				minWidth="700px"
				// width={width}
				height={400}
				onOk={handleOk}
				onCancel={() => setOpen(false)}
			>
				<div ref={ref} id="" className={styles['fillter-dialog__top']}>
					<div className={styles['fillter-tree']}>
						{/* <Tree
							checkable
							checkStrictly
							switcherIcon={<CaretDownOutlined />}
							titleRender={customTreeTitle}
							treeData={treeData}
							onCheck={checkedNodes}
							onSelect={selectNodes}
							loadData={onLoadData}
						/> */}
						<div style={{ whiteSpace: 'nowrap' }}>
							{test.map((item) => (
								<div style={{ display: 'inline-block' }}>
									ceshiceshiceshiceshiceshiceshiceshiceshiceshiceshiceshiceshiceshi
								</div>
							))}
						</div>

						<div onClick={handleTest}>点我</div>
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
