import * as X6 from '@antv/x6';
import React, {
	useRef,
	createContext,
	useContext,
	forwardRef,
	useEffect,
	useState
} from 'react';
import type { ReactNode } from 'react';
import ASSETS from '../assets/index';
import { Stencil } from '@antv/x6-plugin-stencil';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Selection } from '@antv/x6-plugin-selection';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { dispatch } from '../../../../redux/store';
import { toDoubleClickNode } from '../../../../redux/reducers/dataAnalysis';
import { Options } from '@antv/x6/lib/graph/options';
import { message } from 'antd';
import { JoinConfigPanel } from '../components/ConfigPanel';
const { SQL, UNION, JOIN, FILTER, TABLE, GROUP, ORDER, END } = ASSETS;
const GraphContext = createContext<X6.Graph | null>(null);

interface Props {
	className?: string;
	container?: HTMLDivElement;
	children?: ReactNode;
	openMessage: (error: string) => void;
}
const ports = {
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

enum IImageTypes {
	// SQL = 'SQL',
	// UNION = 'UNION',
	JOIN = 'JOIN',
	TABLE = 'TABLE',
	FILTER = 'FILTER',
	GROUP = 'GROUP',
	ORDER = 'ORDER',
	END = 'END'
}

interface IImageShapes {
	label: string;
	image: string;
	type: IImageTypes;
}
const imageShapes: IImageShapes[] = [
	// {
	// 	label: 'SQL',
	// 	image: SQL,
	// 	type: IImageTypes.SQL
	// },
	// {
	// 	label: 'UNION',
	// 	image: UNION,
	// 	type: IImageTypes.UNION
	// },
	{
		label: 'JOIN',
		image: JOIN,
		type: IImageTypes.JOIN
	},
	{
		label: 'TABLE',
		image: TABLE,
		type: IImageTypes.TABLE
	},
	{
		label: 'FILTER',
		image: FILTER,
		type: IImageTypes.FILTER
	},
	{
		label: 'GROUP',
		image: GROUP,
		type: IImageTypes.GROUP
	},
	{
		label: 'END',
		image: END,
		type: IImageTypes.END
	},
	{
		label: 'ORDER',
		image: ORDER,
		type: IImageTypes.ORDER
	}
];
const handleValidateNode: (
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
const validateConnectionRule = (
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
	if (sourceType === IImageTypes.JOIN) {
		if ([IImageTypes.JOIN, IImageTypes.TABLE].includes(targetType)) {
			openMessage('JOIN的输出不能为table或者join');
			return false;
		}
		if (sourceOutEdges && sourceOutEdges.length > 1) {
			openMessage('JOIN输出限制数量为1');
			return false;
		}
	}
	if (targetType === IImageTypes.JOIN) {
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
		if (![IImageTypes.JOIN, IImageTypes.TABLE].includes(sourceType)) {
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
	if (sourceType === IImageTypes.TABLE && targetType === IImageTypes.TABLE) {
		message.error('table不能连接table');
		return false;
	}

	// if (sourceType === IImageTypes.SQL && targetType === IImageTypes.SQL) {
	// 	message.error('sql不能连接sql');
	// 	return false;
	// }
	return true;
};

const getNodeTypeById = (graph: X6.Graph, ids: string[] | string) => {
	const idAry = Array.isArray(ids) ? ids : [ids];
	return idAry.map((id) => {
		const cell = graph.getCellById(id);
		const attrs = cell.getAttrs();
		return attrs.custom.type;
	});
};
const getNodeTypeByCell = (cell: X6.Cell): IImageTypes | null => {
	const attrs = cell.getAttrs();
	const nodeType = attrs?.custom?.type as IImageTypes;
	if (!nodeType) {
		return null;
	}
	return nodeType;
};

const getAllNodeOfGraph = (graph: X6.Graph): Set<string | null> => {
	const nodesType = graph.getNodes().map((cell) => getNodeTypeByCell(cell));
	return new Set(nodesType);
};
export const Graph = forwardRef<X6.Graph, X6.Graph.Options & Props>(
	(props, ref) => {
		const [graph, setGraph] = useState<X6.Graph | null>(null);
		const {
			container,
			children,
			className = 'react-x6-graph',
			openMessage,
			...other
		} = props;
		const containerRef = useRef<HTMLDivElement>(container || null);
		const stencilRef = useRef<HTMLDivElement>(null);

		const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
			for (let i = 0, len = ports.length; i < len; i += 1) {
				ports[i].style.visibility = show ? 'visible' : 'hidden';
			}
		};
		useEffect(() => {
			if (containerRef.current && !graph) {
				const graph = new X6.Graph({
					container: containerRef.current,
					grid: true,
					connecting: {
						router: 'manhattan',
						connector: {
							name: 'rounded',
							args: {
								radius: 8
							}
						},
						anchor: 'center',
						connectionPoint: 'anchor',
						allowBlank: false,
						snap: {
							radius: 20
						},
						createEdge() {
							return new X6.Shape.Edge({
								attrs: {
									line: {
										stroke: '#A2B1C3',
										strokeWidth: 2,
										targetMarker: {
											name: 'block',
											width: 12,
											height: 8
										}
									}
								},
								zIndex: 0
							});
						},
						validateConnection(args) {
							return validateConnectionRule(graph, args, openMessage);
						}
					},
					highlighting: {
						magnetAdsorbed: {
							name: 'stroke',
							args: {
								attrs: {
									fill: '#5F95FF',
									stroke: '#5F95FF'
								}
							}
						}
					},
					...other
				});
				graph
					.use(
						new Snapline({
							enabled: true,
							sharp: true
						})
					)
					.use(
						new Selection({
							enabled: true,
							rubberband: true,
							showNodeSelectionBox: true
						})
					)
					.use(new Keyboard({ enabled: true }));
				setGraph(graph);
				if (typeof ref === 'function') {
					ref(graph);
				} else if (ref) {
					ref.current = graph;
				}
				if (stencilRef.current) {
					const stencil = new Stencil({
						target: graph,
						collapsable: true,
						stencilGraphWidth: 180,
						stencilGraphHeight: 320,
						groups: [
							{
								name: 'group1'
							}
						],
						validateNode: (node) => handleValidateNode(graph, node)
					});
					X6.Graph.registerNode(
						'custom-image',
						{
							inherit: 'rect',
							width: 52,
							height: 52,
							markup: [
								{
									tagName: 'rect',
									selector: 'body'
								},
								{
									tagName: 'image'
								},
								{
									tagName: 'text',
									selector: 'label'
								}
							],
							attrs: {
								body: {
									stroke: '#5F95FF',
									fill: '#5F95FF'
								},
								image: {
									width: 26,
									height: 26,
									refX: 13,
									refY: 16
								},
								label: {
									refX: 3,
									refY: 2,
									textAnchor: 'left',
									textVerticalAnchor: 'top',
									fontSize: 12,
									fill: '#fff'
								}
							},
							ports: { ...ports }
						},
						true
					);
					const imageNodes = imageShapes.map((item) =>
						graph.createNode({
							shape: 'custom-image',
							label: item.label,
							attrs: {
								image: {
									'xlink:href': item.image
								},
								custom: { type: item.type }
							}
						})
					);

					stencil.load(imageNodes, 'group1');
					stencilRef?.current?.appendChild(stencil.container);
				}
			}
		}, [graph, other, ref]);
		useEffect(() => {
			if (!graph) {
				return;
			}
			graph.on('node:mouseenter', () => {
				const container = document.getElementById('x6-graph')!;
				const ports = container.querySelectorAll(
					'.x6-port-body'
				) as NodeListOf<SVGElement>;
				showPorts(ports, true);
			});
			graph.on('node:mouseleave', () => {
				const container = document.getElementById('x6-graph')!;
				const ports = container.querySelectorAll(
					'.x6-port-body'
				) as NodeListOf<SVGElement>;
				showPorts(ports, false);
			});
			graph.on('node:dblclick', ({ node }) => {
				const { id } = node;
				dispatch(toDoubleClickNode({ id, showPanel: true }));
				const cell = graph.getCellById(id);
				const clickNodeType = getNodeTypeById(graph, id)[0] as IImageTypes;
				const { JOIN, FILTER, TABLE } = IImageTypes;
				if ([UNION, JOIN].includes(clickNodeType)) {
					console.log('union or join');
				}
				if ([FILTER].includes(clickNodeType)) {
				}
				if (TABLE === clickNodeType) {
				}

				if (SQL === clickNodeType) {
				}
				const edges = graph.getEdges();
				const sourceNodes: string[] = [];
				// 找到节点的所有连接节点
				edges.forEach((e) => {
					const sourceID = e.getSourceCellId();
					const targetID = e.getTargetCellId();
					if (targetID === id) {
						sourceNodes.push(sourceID);
					}
				});
				// 获取到所有连接节点的type
				const types = getNodeTypeById(graph, sourceNodes);
				// todo: >= 2
				if (types.filter((v) => v !== IImageTypes.SQL).length < 2) {
				}
				// if (cell.isNode()) {
				// 	const ports = cell.getPorts();
				// 	ports.forEach(({ id }) => {
				// 		console.log('port props', cell.getPortProp(id || ''));
				// 	});
				// }
			});
			graph.bindKey(['meta+a', 'ctrl+a'], () => {
				const nodes = graph.getNodes();
				if (nodes) {
					graph.select(nodes);
				}
			});
			graph.on('node:added', ({ cell }) => {
				// getNodeTypeByCell(cell);
			});
			// delete
			graph.bindKey('backspace', () => {
				const cells = graph.getSelectedCells();
				if (cells.length) {
					graph.removeCells(cells);
				}
			});
			return () => {
				graph.off('node:mouseenter');
				graph.off('node:mouseleave');
				graph.unbindKey('backspace');
				graph.unbindKey(['meta+a', 'ctrl+a']);
			};
		}, [graph]);
		return (
			<div
				className={className}
				style={{
					width: '100%',
					height: '100%',
					position: 'relative',
					display: 'flex'
				}}
			>
				<GraphContext.Provider value={graph}>
					<div
						className="x6-stencil"
						ref={stencilRef}
						style={{ position: 'relative', width: '200px', height: '400px' }}
					></div>
					<div className="x6-content" id="x6-graph" ref={containerRef}></div>

					{!!graph && children}
				</GraphContext.Provider>
			</div>
		);
	}
);

export const useGraphInstance = () => useContext(GraphContext);
