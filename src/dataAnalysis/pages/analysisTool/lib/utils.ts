import { Graph, Node, Edge, ObjectExt, StringExt } from '@antv/x6';
import { getCanvasConfig, getResult } from '@/api/dataAnalysis/graph';
import * as X6 from '@antv/x6';
import { hashCode } from 'hashcode';
type Metadata = Node.Metadata | Edge.Metadata;
type C = Node | Edge;
type T = C | { [key: string]: any };
type U = T[];
export enum IImageTypes {
	CONNECT = 'CONNECT',
	FILTER = 'FILTER',
	GROUP = 'GROUP',
	ORDER = 'ORDER',
	END = 'END',
	TABLE = 'TABLE'
}
export const diffCells = (
	graph: Graph | null,
	cells: Metadata[] = [],
	type = 'node'
) => {
	const create: C[] = [];
	const update: U[] = [];
	const remove: string[] = [];
	if (graph) {
		const Ctor = type === 'node' ? Node.create : Edge.create;
		cells.forEach((c) => {
			const cell = graph.getCellById(c.id);
			if (cell) {
				// 这里尝试重新调用一下create，然后通过setProp，直接将新创建的放进去
				const t = Ctor(c);
				const prop = t.getProp();
				t.dispose();
				if (!ObjectExt.isEqual(cell.getProp(), prop)) {
					update.push([cell, prop]);
				}
			} else {
				create.push(Ctor(c));
			}
		});
		const cellIds = new Set(cells.map((c) => c.id));
		const items = type === 'node' ? graph.getNodes() : graph.getEdges();
		items.forEach((cell) => {
			if (!cellIds.has(cell.id)) {
				remove.push(cell.id);
			}
		});
	}
	return { create, update, remove };
};

export const patch = (
	graph: Graph | null,
	data: ReturnType<typeof diffCells>
) => {
	const { create = [], update = [], remove = [] } = data;
	// console.log('patch', create, update, remove)
	if (graph) {
		graph.batchUpdate(
			'update',
			() => {
				graph.addCell(create);
				update.forEach(([cell, prop]) => {
					// 直接一次性更新全部的prop可能导致部分属性更新不成功 cell.setProp(prop)
					// @ts-ignore
					Object.keys(prop).forEach((key: string) =>
						cell.setProp(key, prop[key])
					);
				});
				remove.forEach((item) => graph.removeCell(item));
			},
			data
		);
	}
};

// 如果没有id就添加一个
export const checkId = (metadata: Metadata) =>
	({ ...metadata, id: metadata.id || StringExt.uuid() } as Metadata);
export const handleValidateNode: (
	graph: X6.Graph,
	droppingNode: X6.Node
) => boolean = (graph, droppingNode) => {
	const type = getNodeTypeByCell(droppingNode);

	if (!type) {
		return false;
	}
	const currentNodesType = getAllNodeOfGraph(graph);
	// todo: error提示
	if ([IImageTypes.GROUP, IImageTypes.ORDER, IImageTypes.END].includes(type)) {
		if (currentNodesType.has(IImageTypes.GROUP) && type === IImageTypes.GROUP) {
			message.error('不能存在多个分组');
			return false;
		}
		if (currentNodesType.has(IImageTypes.ORDER) && type === IImageTypes.ORDER) {
			message.error('不能存在多个排序');
			return false;
		}
		if (currentNodesType.has(IImageTypes.END) && type === IImageTypes.END) {
			message.error('不能存在多个END');
			return false;
		}
	}
	return true;
};
export const validateConnectionRule = (
	graph: X6.Graph,
	params: Options.ValidateConnectionArgs,
	openMessage: (error: string) => void
): boolean => {
	const { sourceCell, targetCell, edge } = params;
	const edgeID = edge?.id;

	if (!sourceCell || !targetCell) {
		return false;
	}
	const getAttrsById = (id: string) => {
		const cell = graph.getCellById(id);
		return cell.getAttrs();
	};
	const [sourceOutEdges, sourceInEdges] = [
		graph.getOutgoingEdges(sourceCell),
		graph.getIncomingEdges(sourceCell)
	];
	const [targetOutEdges, targetInEdges] = [
		graph.getOutgoingEdges(targetCell),
		graph.getIncomingEdges(targetCell)
	];

	const sourceCellID = sourceCell?.id;
	const targetCellID = targetCell?.id;

	if (sourceCellID === targetCellID) {
		// message.error('不能自连接');
		return false;
	}
	if (!sourceCellID || !targetCellID) {
		return false;
	}
	const sourceCellAttrs = getAttrsById(sourceCell.id);
	const targetCellAttrs = getAttrsById(targetCell.id);

	const sourceType = sourceCellAttrs.custom?.type as IImageTypes;
	const targetType = targetCellAttrs.custom?.type as IImageTypes;
	const targetInEdgesIDs = targetInEdges
		? targetInEdges.map((edge) => edge.id).filter((id) => id !== edgeID)
		: [];
	//  “TABLE”节点：无输入，仅输出（支持多输出，输出可以接任意节点类型）
	if (targetType === IImageTypes.TABLE) {
		openMessage('表不能有输入结点');
		return false;
	}
	// if (sourceType === IImageTypes.TABLE && targetType === IImageTypes.TABLE) {
	// 	message.error('table不能连接table');
	// 	return false;
	// }

	// JOIN
	if (sourceType === IImageTypes.CONNECT) {
		if ([IImageTypes.CONNECT, IImageTypes.TABLE].includes(targetType)) {
			openMessage('连接的输出不能为表或者连接');
			return false;
		}
		if (sourceOutEdges && sourceOutEdges.length > 1) {
			openMessage('连接输出限制数量为1');
			return false;
		}
	}
	if (targetType === IImageTypes.CONNECT) {
		if (targetInEdgesIDs.length > 1) {
			openMessage('连接支持最多两个表输入');
			return false;
		}
	}
	// FILTER
	if (sourceType === IImageTypes.FILTER) {
		if (
			![IImageTypes.GROUP, IImageTypes.ORDER, IImageTypes.END].includes(
				targetType
			)
		) {
			openMessage('输出可以接节点类型为“分组”类型或者“排序”类型或者“结束”类型');
			return false;
		}
		if (sourceOutEdges && sourceOutEdges.length > 1) {
			openMessage('筛选输出限制数量为1');
			return false;
		}
	}
	if (targetType === IImageTypes.FILTER) {
		if (![IImageTypes.CONNECT, IImageTypes.TABLE].includes(sourceType)) {
			openMessage('筛选的输入结点只能为table或者join');
			return false;
		}

		if (targetInEdgesIDs.length > 0) {
			openMessage('筛选输入限制数量为1');
			return false;
		}
	}

	// GROUP BY
	if (targetType === IImageTypes.GROUP) {
		if ([IImageTypes.END, IImageTypes.GROUP].includes(sourceType)) {
			openMessage('输入节点类型为除“结束”和“分组”以外的类');
			return false;
		}
		if (targetInEdgesIDs.length > 0) {
			openMessage('分组输入限制数量为1');
			return false;
		}
	}
	// ORDER BY
	if (targetType === IImageTypes.ORDER) {
		if ([IImageTypes.END, IImageTypes.ORDER].includes(sourceType)) {
			openMessage('输入节点类型为除“结束”和“排序”以外的类型');
			return false;
		}
		if (targetInEdgesIDs.length > 0) {
			openMessage('排序输入限制数量为1');
			return false;
		}
	}
	// END
	if (targetType === IImageTypes.END) {
		if (targetInEdgesIDs.length > 0) {
			openMessage('结束输入限制数量为1');
			return false;
		}
	}
	if (sourceType === IImageTypes.END) {
		openMessage('结束不能有输出');
		return false;
	}

	// if (sourceType === IImageTypes.SQL && targetType === IImageTypes.SQL) {
	// 	message.error('sql不能连接sql');
	// 	return false;
	// }
	// 连接成功 -> 可能改变source -> 需要关闭重新执行
	onClickCloseConfigPanel();
	return true;
};

export const getNodeTypeById = (graph: X6.Graph, ids: string[] | string) => {
	const idAry = Array.isArray(ids) ? ids : [ids];
	return idAry.map((id) => {
		const cell = graph.getCellById(id);
		if (!cell) {
			return null;
		}
		const attrs = cell.getAttrs();
		return attrs.custom.type;
	});
};
export const getNodeTypeByCell = (cell: X6.Cell): IImageTypes | null => {
	const attrs = cell.getAttrs();
	const nodeType = attrs?.custom?.type as IImageTypes;
	if (!nodeType) {
		return null;
	}
	return nodeType;
};

export const getAllNodeOfGraph = (graph: X6.Graph): Set<string | null> => {
	const nodesType = graph.getNodes().map((cell) => getNodeTypeByCell(cell));
	return new Set(nodesType);
};

export interface IImageShapes {
	label: string;
	image: string;
	activeImage?: string;
	type: IImageTypes;
	labelCn?: string;
}

import ASSETS from '../assets/index';
import { message } from 'antd';
import { Options } from '@antv/x6/lib/graph/options';
import { saveProjectCanvas } from '@/api/dataAnalysis/graph';
import React, { useEffect } from 'react';
import { onClickCloseConfigPanel } from '@/redux/store';

const {
	FILTER,
	CONNECT,
	GROUP,
	ORDER,
	END,
	CONNECTACTIVE,
	FILTERACTIVE,
	ENDACTIVE,
	GROUPACTIVE,
	ORDERACTIVE
} = ASSETS;
export const imageShapes: IImageShapes[] = [
	{
		label: '连接',
		image: CONNECT,
		activeImage: CONNECTACTIVE,
		type: IImageTypes.CONNECT
	},
	{
		label: '筛选',
		image: FILTER,
		activeImage: FILTERACTIVE,
		type: IImageTypes.FILTER
	},
	{
		label: '排序',
		image: ORDER,
		activeImage: ORDERACTIVE,
		type: IImageTypes.ORDER
	},
	{
		label: '分组',
		image: GROUP,
		activeImage: GROUPACTIVE,
		type: IImageTypes.GROUP
	},
	{
		label: '结束',
		image: END,
		activeImage: ENDACTIVE,
		type: IImageTypes.END
	}
];
interface ISaveData
	extends Pick<
		Parameters<typeof saveProjectCanvas>[0],
		'configs' | 'projectId'
	> {
	canvas: {
		cells: X6.Cell.Properties[];
	};
}
export const saveData: (params: ISaveData) => void = ({
	canvas,
	projectId,
	configs = null
}) => {
	if (!canvas || !projectId) {
		return;
	}

	saveProjectCanvas({
		canvasJson: JSON.stringify({
			content: canvas,
			configs
		}),
		projectId
	});
};

export const syncData = (
	projectID: number | null,
	graph: X6.Graph | null,
	configs: any
) => {
	if (!projectID || !graph) {
		return;
	}
	saveData({
		canvas: graph?.toJSON(),
		projectId: projectID,
		configs: configs
	});
};
export const useInitRender = () => {
	const ref = React.useRef({ init: true });
	useEffect(() => {
		ref.current.init = false;
	}, []);
	return ref.current.init;
};

export const formatDataSource = (data: any[], head: string[]) => {
	// 获取数据转换成表格数据

	interface IColumn {
		title: string;
		dataIndex: string;
		key: string;
	}
	const columns: IColumn[] = head.map((item, index) => {
		return {
			title: item,
			dataIndex: item,
			key: item
		};
	});
	const columnsName = columns.map((c) => c.dataIndex);
	const formatData = data.map((row) => {
		const dataObj: Record<string, any> = {};
		row.forEach((v, index) => {
			dataObj[columnsName[index]] = v;
		});
		return dataObj;
	});

	return { data: formatData, columns };
};

export const ports = {
	groups: {
		top: {
			position: 'top',
			attrs: {
				circle: {
					r: 4,
					magnet: true,
					stroke: '#5F95FF',
					strokeWidth: 1,
					fill: '#fff',
					style: {
						visibility: 'hidden'
					}
				}
			}
		},
		right: {
			position: 'right',
			attrs: {
				circle: {
					r: 4,
					magnet: true,
					stroke: '#5F95FF',
					strokeWidth: 1,
					fill: '#fff',
					style: {
						visibility: 'hidden'
					}
				}
			}
		},
		bottom: {
			position: 'bottom',
			attrs: {
				circle: {
					r: 4,
					magnet: true,
					stroke: '#5F95FF',
					strokeWidth: 1,
					fill: '#fff',
					style: {
						visibility: 'hidden'
					}
				}
			}
		},
		left: {
			position: 'left',
			attrs: {
				circle: {
					r: 4,
					magnet: true,
					stroke: '#5F95FF',
					strokeWidth: 1,
					fill: '#fff',
					style: {
						visibility: 'hidden'
					}
				}
			}
		}
	},
	items: [
		{
			group: 'top'
		},
		{
			group: 'right'
		},
		{
			group: 'bottom'
		},
		{
			group: 'left'
		}
	]
};

export const getLabelLength = (str: string) => {
	const Regx = /^[A-Za-z0-9]*$/;
	let len = 0;
	for (let i = 0; i < str.length; i++) {
		if (Regx.test(str.charAt(i))) {
			len = len + 8;
		} else {
			len = len + 14;
		}
	}
	return len;
};

export const encodeNodeSources = (sources: string[]): number => {
	const sourcesStr = sources.join('-');
	return hashCode().value(sourcesStr);
};
