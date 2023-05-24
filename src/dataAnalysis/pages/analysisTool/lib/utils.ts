import { Graph, Node, Edge, ObjectExt, StringExt } from '@antv/x6';
import * as X6 from '@antv/x6';
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
	type: string = 'node'
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
			message.error('不能存在多个Group');
			return false;
		}
		if (currentNodesType.has(IImageTypes.ORDER) && type === IImageTypes.ORDER) {
			message.error('不能存在多个ORDEr');
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
	const { sourceCell, targetCell } = params;
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
	//  “TABLE”节点：无输入，仅输出（支持多输出，输出可以接任意节点类型）
	if (targetType === IImageTypes.TABLE) {
		openMessage('table不能有输入结点');
		return false;
	}

	// JOIN
	if (sourceType === IImageTypes.CONNECT) {
		if ([IImageTypes.CONNECT, IImageTypes.TABLE].includes(targetType)) {
			openMessage('JOIN的输出不能为table或者join');
			return false;
		}
		if (sourceOutEdges && sourceOutEdges.length > 1) {
			openMessage('JOIN输出限制数量为1');
			return false;
		}
	}
	if (targetType === IImageTypes.CONNECT) {
		if (targetInEdges && targetInEdges.length >= 2) {
			openMessage('JOIN支持最多两个table输入');
			return false;
		}
	}
	// FILTER
	if (sourceType === IImageTypes.FILTER) {
		if (![IImageTypes.GROUP, IImageTypes.ORDER].includes(targetType)) {
			openMessage('filter的输出只能为group by或者order by');
			return false;
		}
		if (sourceOutEdges && sourceOutEdges.length > 1) {
			openMessage('filter输出限制数量为1');
			return false;
		}
	}
	if (targetType === IImageTypes.FILTER) {
		if (![IImageTypes.CONNECT, IImageTypes.TABLE].includes(sourceType)) {
			openMessage('filter的输入结点只能为table或者join');
			return false;
		}
		if (targetInEdges && targetInEdges.length > 0) {
			openMessage('filter输入限制数量为1');
			return false;
		}
	}

	// GROUP BY
	if (targetType === IImageTypes.GROUP) {
		if ([IImageTypes.END, IImageTypes.GROUP].includes(sourceType)) {
			message.error('group by的输入不能为group by或者end');
			return false;
		}
		if (targetInEdges && targetInEdges.length >= 1) {
			openMessage('GROUP BY输入限制数量为1');
			return false;
		}
	}
	// ORDER BY
	if (targetType === IImageTypes.ORDER) {
		if ([IImageTypes.END, IImageTypes.ORDER].includes(sourceType)) {
			message.error('order by的输入不能为order by或者end');
			return false;
		}
		if (targetInEdges && targetInEdges.length >= 1) {
			openMessage('ORDER BY输入限制数量为1');
			return false;
		}
	}
	// END
	if (targetType === IImageTypes.END) {
		if (targetInEdges && targetInEdges.length >= 1) {
			openMessage('END输入限制数量为1');
			return false;
		}
	}
	if (sourceType === IImageTypes.END) {
		openMessage('END不能有输出');
		return false;
	}
	if (sourceType === IImageTypes.TABLE && targetType === IImageTypes.CONNECT) {
		message.error('table不能连接table');
		return false;
	}

	// if (sourceType === IImageTypes.SQL && targetType === IImageTypes.SQL) {
	// 	message.error('sql不能连接sql');
	// 	return false;
	// }
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
	type: IImageTypes;
}

import ASSETS from '../assets/index';
import { message } from 'antd';
import { Options } from '@antv/x6/lib/graph/options';
const { FILTER, CONNECT, GROUP, ORDER, END } = ASSETS;
export const imageShapes: IImageShapes[] = [
	{
		label: '连接',
		image: CONNECT,
		type: IImageTypes.CONNECT
	},
	{
		label: '筛选',
		image: FILTER,
		type: IImageTypes.FILTER
	},
	{
		label: '分组',
		image: GROUP,
		type: IImageTypes.GROUP
	},
	{
		label: '结束',
		image: END,
		type: IImageTypes.END
	},
	{
		label: '排序',
		image: ORDER,
		type: IImageTypes.ORDER
	}
];
