import * as X6 from '@antv/x6';
import React, {
	useRef,
	createContext,
	useContext,
	forwardRef,
	useEffect,
	useState,
	useCallback
} from 'react';
import type { ReactNode } from 'react';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Selection } from '@antv/x6-plugin-selection';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { dispatch } from '../../../../redux/store';
import { toDoubleClickNode } from '../../../../redux/reducers/dataAnalysis';
import { Options } from '@antv/x6/lib/graph/options';
import { Divider, message } from 'antd';
import { Dnd } from '@antv/x6-plugin-dnd';

interface IGraphContext {
	graph: X6.Graph;
	startDrag: (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		{ label, image, type }: IImageShapes
	) => void;
}

export const useGraph = () => {
	const { graph } = useContext(GraphContext) || {};
	return graph;
};

export const GraphContext = createContext<IGraphContext | null>(null);
import classes from './graph.module.less';
import TableSourcePanel from '../components/TableSourcePanel';
import {
	IImageShapes,
	IImageTypes,
	getNodeTypeById,
	handleValidateNode,
	imageShapes,
	validateConnectionRule
} from './utils';
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

export const Graph = forwardRef<X6.Graph, X6.Graph.Options & Props>(
	(props, ref) => {
		const [graph, setGraph] = useState<X6.Graph | null>(null);
		const [dnd, setDnd] = useState<Dnd | null>(null);
		const [panelDnd, setPanelDnd] = useState<Dnd | null>(null);
		const [openLeftPanel, setOpenLeftPanel] = useState<boolean>(true);
		const {
			container,
			children,
			className = 'react-x6-graph',
			openMessage,
			...other
		} = props;
		const containerRef = useRef<HTMLDivElement>(container || null);
		const graphWrapperRef = useRef<HTMLDivElement>(null);
		const DndContainerRef = useRef<HTMLDivElement>(null);
		const panelDndContainerRef = useRef<HTMLDivElement>(null);

		const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
			for (let i = 0, len = ports.length; i < len; i += 1) {
				ports[i].style.visibility = show ? 'visible' : 'hidden';
			}
		};
		// 初始化画布和dnd
		useEffect(() => {
			if (graphWrapperRef.current && containerRef.current && !graph) {
				const graph = new X6.Graph({
					container: containerRef.current,
					autoResize: false,
					grid: true,
					width: graphWrapperRef.current.offsetWidth,
					height: graphWrapperRef.current.offsetHeight,
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
					}
					// highlighting: {
					// 	magnetAdsorbed: {
					// 		name: 'stroke',
					// 		args: {
					// 			attrs: {
					// 				fill: '#5F95FF',
					// 				stroke: '#5F95FF'
					// 			}
					// 		}
					// 	}
					// },
					// ...other
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

				// 初始化SQL组件
				if (DndContainerRef.current) {
					const dnd = new Dnd({
						target: graph,
						validateNode: (node) => handleValidateNode(graph, node),
						dndContainer: DndContainerRef.current
					});
					setDnd(dnd);
				}
				// 初始化左侧表单列表
				if (panelDndContainerRef.current) {
					const dnd = new Dnd({
						target: graph,
						validateNode: (node) => handleValidateNode(graph, node),
						dndContainer: panelDndContainerRef.current
					});
					setPanelDnd(dnd);
				}
			}
		}, [graph, other, ref]);
		// 监听事件
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
				const { CONNECT, FILTER, TABLE } = IImageTypes;
				if ([CONNECT].includes(clickNodeType)) {
					console.log('union or join');
				}
				// if ([FILTER].includes(clickNodeType)) {
				// }
				// if (TABLE === clickNodeType) {
				// }

				// if (SQL === clickNodeType) {
				// }
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
		const handleResize = () => {
			if (graphWrapperRef && graphWrapperRef.current && graph) {
				const wrapperWidth = graphWrapperRef.current.offsetWidth;
				const wrapperHeight = graphWrapperRef.current?.offsetHeight;

				const { cells } = graph.toJSON();
				// 给边缘留的距离
				const graphOffsetWidth = 200;
				const graphOffsetHeight = 100;
				let maxOffsetWidth = wrapperWidth,
					maxoffsetHeight = wrapperHeight;
				cells.forEach((cell) => {
					const { x, y } = cell.position;
					maxOffsetWidth = Math.max(x + graphOffsetWidth, maxOffsetWidth);
					maxoffsetHeight = Math.max(y + graphOffsetHeight, maxoffsetHeight);
				});
				graph.resize(maxOffsetWidth, maxoffsetHeight);
				// graph?.resize(containWidth, containHeight);
			}
		};

		useEffect(() => {
			window.addEventListener('resize', handleResize);
			return () => window.removeEventListener('resize', handleResize);
		}, [graph]);
		const startDrag = (
			e: React.MouseEvent<HTMLDivElement, MouseEvent>,
			{ label, image, type }: IImageShapes
		) => {
			if (!graph) {
				return;
			}
			const node = graph?.createNode({
				inherit: 'rect',
				width: type === IImageTypes.TABLE ? label.length * 14 + 40 : 72,
				height: 38,
				label: label,
				markup: [
					{
						tagName: 'rect',
						selector: 'body'
					},
					{
						tagName: 'image',
						selector: 'img'
					},
					{
						tagName: 'text',
						selector: 'label'
					}
				],
				attrs: {
					body: {
						stroke: '#ccc',
						fill: '#fff',
						strokeWidth: 1,
						rx: 4,
						ry: 4,
						overflow: 'auto'
					},
					img: {
						'xlink:href': image,
						width: 20,
						height: 20,
						y: 10,
						x: 6
					},
					label: {
						refX: 22,
						refY: 6,
						fontWeight: 400,
						color: '#18181F',
						lineHeight: '22px',
						textAnchor: 'left',
						textVerticalAnchor: 'top',
						fontSize: 14,
						y: 10,
						x: 12,
						fill: '#18181F'
					},
					custom: {
						type: type
					}
				},
				ports: { ...ports }
			});
			dnd?.start(node, e.nativeEvent as any);
		};
		return (
			<GraphContext.Provider value={{ graph, startDrag }}>
				<div className={classes.container}>
					<div className="x6-panel" ref={panelDndContainerRef}>
						<TableSourcePanel setOpen={setOpenLeftPanel} open={openLeftPanel} />
					</div>
					<div
						className={classes['right-container']}
						style={{ width: `calc(100% - ${openLeftPanel ? 240 : 0}px)` }}
					>
						<div className={classes['control-wrapper']}>
							<div
								className={classes['save-btn']}
								onClick={() => {
									graph?.centerContent();
								}}
							>
								保存为审计模板
							</div>
							<div
								className="x6-dnd"
								ref={DndContainerRef}
								style={{
									position: 'relative',
									width: '380px',
									height: '44px',
									display: 'flex'
								}}
							>
								{imageShapes.map(({ label, image, type }, index) => {
									return (
										<div
											style={{ display: 'flex', alignItems: 'center' }}
											key={type}
											onMouseDown={(e) => startDrag(e, { label, image, type })}
										>
											<img src={image}></img>
											<span
												style={{ marginLeft: '8px', pointerEvents: 'none' }}
											>
												{label}
											</span>
											{index + 1 !== imageShapes.length && (
												<Divider type="vertical" />
											)}
										</div>
									);
								})}
							</div>
						</div>
						<div
							ref={graphWrapperRef}
							style={{
								width: '100%',
								height: 'calc(100% - 50px)',
								overflow: 'auto'
							}}
						>
							<div
								className="x6-content"
								id="x6-graph"
								ref={containerRef}
							></div>
						</div>

						{!!graph && children}
					</div>
				</div>
			</GraphContext.Provider>
		);
	}
);

export const useGraphInstance = () => useContext(GraphContext);
