import React, { useState, useRef, useEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { Button, Tree, message } from 'antd';
import CustomDialog from '@/components/custom-dialog';
import {
	CaretDownOutlined,
	CloseOutlined,
	ArrowRightOutlined,
	RightOutlined,
	CloseCircleOutlined,
	CloseCircleFilled
} from '@ant-design/icons';
import FillterAttr, { ComponentsType } from './fillterAttr';
import SvgIcon from '@/components/svg-icon';
import styles from './index.module.less';

import { IPath, IProperty, getNextPaths } from '@/api/knowLedgeGraph/graphin';
import { FormItems } from '../sideBar';
import { spawn } from 'child_process';

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
	updateGraph: (paths: IPath[] | null) => void;
	// setCurPath: (paths: IPath[] | null) => void;
	canUse: boolean; //是否禁用
}
export default (props: IProps) => {
	const {
		getFormItemValue,
		setFormItemValue,
		updateGraph,
		// setCurPath
		canUse
	} = props;
	const fillterAttrRef = useRef(null);
	const [open, setOpen] = useState(false);
	const [saveNodes, setSaveNodes] = useState<string[]>([]); //需要保存的节点内容
	const [treeData, setTreeData] = useState<ITreeData[]>([]); //树结构渲染用的数据

	const nodeConfigNProperties = useRef(new Map<string, INodeConfigNProps>());
	const cntInitRef = useRef<boolean>(true);
	const [selectNodeID, setSelectedNodeID] = useState<string | null>(null);
	const nodeFilter = getFormItemValue(FormItems.bodyFilter);
	console.log(nodeFilter, 72727272);
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

	// useEffect(() => {
	// 	if (!cntInitRef.current) return;
	// 	setTreeData([]);
	// 	setCurPath(null);
	// }, [curNodeType, curNodeVaule]);
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
			console.log(nodeFilter, 104104104);
			const res = await getNextPaths({
				// nodeFilter,
				nodeFilter: getFormItemValue(FormItems.bodyFilter),
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
	// todo
	// const resetDialog = async () => {
	// 	if (!curNodeType || !curNodeVaule) {
	// 		message.error('未选择主体');
	// 		return;
	// 	}
	// 	const res = await getNextPaths({
	// 		nodeFilter,
	// 		parentPaths: [],
	// 		type: curNodeType,
	// 		value: curNodeVaule
	// 	});
	// 	const formatDataTree = changeDataTree(res);
	// 	setTreeData(formatDataTree);
	// 	const configData = transData(formatDataTree);

	// 	updateGraph(configData);
	// 	setCurPath(configData); //当前选中链路数据
	// };
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
		console.log(treeData, 217217);
		const configData = transData(treeData);
		console.log(configData, 221221221);
		setFormItemValue('paths', configData);
		setOpen(false);
	};
	const getNodeDataConverted = (id: string): IProperty[] => {
		const rawData = nodeConfigNProperties.current.get(id)?.configInfo || {};

		console.log(rawData, 232323232);

		const convertProperties = Object.entries(rawData).map(([label, v]) => {
			if (!saveNodes.includes(id)) {
				return null;
			}
			const { value, type, key } = v;

			const formatValue: Pick<IProperty, 'operationLinks' | 'operations'> = {
				operationLinks: [],
				operations: []
			};
			if (ComponentsType.PERSON.includes(String(type))) {
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

			if (ComponentsType.DATE.includes(String(type))) {
				const [start, end] = value;
				if (!start || !end) {
					formatValue.operationLinks = [];
					formatValue.operations = [];
				} else {
					formatValue.operationLinks.push(1);
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
			}

			if (ComponentsType.GENDER.includes(String(type))) {
				// formatValue.operations.push({
				// 	operatorType: 1,
				// 	value: value
				// });
				value.forEach((item: string, index: number) => {
					if (index > 0) {
						formatValue.operationLinks.push(2);
					}
					formatValue.operations.push({
						operatorType: 1,
						value: item
					});
				});
			}

			if (ComponentsType.RANGE.includes(String(type))) {
				console.log(value, 290290290290);
				// 为空时不穿值
				if (
					value?.operations.length == 1 &&
					!value?.operations[0]?.operatorType &&
					!value?.operations[0]?.value
				) {
					formatValue.operationLinks = [];
					formatValue.operations = [];
				} else {
					formatValue.operationLinks = value?.operationLinks || [];
					formatValue.operations = value?.operations || [];
				}
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

		console.log(convertProperties, 30003000000);
		return convertProperties.filter((p) => p !== null) as IProperty[];
	};

	//转成后台需要的数据形式
	const transData = (list: ITreeData[]): IPath[] | null => {
		console.log(list, 292292292);
		const listTrans = list.map((item: ITreeData) => {
			const { children, title, key } = item;
			const nextPaths = transData(children);
			const properties = getNodeDataConverted(key);

			console.log(properties, 297297297);

			if (!saveNodes.includes(key)) {
				if (nextPaths && nextPaths.filter((v) => v !== null).length === 0) {
					return null;
				}
				if (!nextPaths) {
					return null;
				}
			}
			return {
				name: title,
				nextPaths: nextPaths || [],
				properties
			};
		});
		const listTransNoNull = listTrans.filter((v) => v !== null) as IPath[];
		// const listTransNoNull = listTrans.filter((v) => !v) as IPath[];
		return listTransNoNull.length === 0 ? null : listTransNoNull;
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
		console.log(node.key, 348348);
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

		console.log(nodeConfigNProperties.current, 370370);
	};

	const getOnePath = (treeData: ITreeData[]): ITreeData | null => {
		if (!treeData || treeData.length === 0) {
			return null;
		}
		for (const item of treeData) {
			if (saveNodes.includes(item.key)) {
				const child = getOnePath(item.children);
				return child ? child : item;
			} else {
				const path = getOnePath(item.children);
				if (path) {
					return path;
				}
			}
		}

		return null;
	};
	const convertPathToHint = (): string => {
		if (canUse) {
			const item = getOnePath(treeData);
			return item ? item.path.join('  ->  ') : '';
		} else {
			return '';
		}
	};

	const cleanPath = (e) => {
		e.stopPropagation();
		setFormItemValue('paths', null);
		setSaveNodes([]);
		setSelectedNodeID(null);
		// 重置选项，打开时重新请求数据
		cntInitRef.current = true;
	};

	const ref = useRef(null);
	const [width, setWidth] = useState(700);

	useEffect(() => {
		if (open) {
			const ro = new ResizeObserver((entries, observer) => {
				for (const entry of entries) {
					const { width } = entry.contentRect;
					setWidth(+width + 440);
				}
			});
			ro.observe(ref.current);
		}
	}, [open]);

	return (
		<>
			<Button
				disabled={!canUse}
				onClick={() => changeDialogOpen()}
				style={{
					width: '100%',
					textOverflow: 'ellipsis',
					overflow: 'hidden'
				}}
			>
				<div className={styles['fillter-into-button']}>
					{convertPathToHint() ? (
						<>
							<span
								style={{
									maxWidth: '160px',
									overflow: 'hidden',
									textOverflow: 'ellipsis'
								}}
							>
								{convertPathToHint()}
							</span>
							<span
								className={styles['clean-path-icon']}
								// style={{ color: 'rgba(0, 0, 0, 0.25)' }}
								onClick={cleanPath}
							>
								<CloseCircleFilled style={{ fontSize: '12px' }} />
							</span>
						</>
					) : (
						<>
							<span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>请选择</span>
							<span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>
								<RightOutlined />
							</span>
						</>
					)}
				</div>
			</Button>
			{/* <CloseOutlined
				onClick={() => {
					resetDialog();
				}}
			/> */}
			<CustomDialog
				open={open}
				title="链路筛选"
				minWidth="700px"
				width={width}
				// height={400}
				onOk={handleOk}
				onCancel={() => setOpen(false)}
			>
				<div className={styles['fillter-dialog__top']}>
					<div ref={ref} id="fillter-tree" className={styles['fillter-tree']}>
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
