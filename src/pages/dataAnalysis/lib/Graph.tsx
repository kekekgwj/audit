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

const { SQL, UNION, JOIN, FILTER, TABLE } = ASSETS;
const GraphContext = createContext<X6.Graph | null>(null);

interface Props {
	className?: string;
	container?: HTMLDivElement;
	children?: ReactNode;
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
const imageShapes = [
	{
		label: 'SQL',
		image: SQL
	},
	{
		label: 'UNION',
		image: UNION
	},
	{
		label: 'JOIN',
		image: JOIN
	},
	{
		label: 'TABLE',
		image: TABLE
	},
	{
		label: 'FILTER',
		image: FILTER
	}
];
export const Graph = forwardRef<X6.Graph, X6.Graph.Options & Props>(
	(props, ref) => {
		const [graph, setGraph] = useState<X6.Graph | null>(null);
		const {
			container,
			children,
			className = 'react-x6-graph',
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
						validateConnection({ targetMagnet }) {
							return !!targetMagnet;
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
						]
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
								}
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
				console.log(node.id);
			});
			graph.bindKey(['meta+a', 'ctrl+a'], () => {
				const nodes = graph.getNodes();
				if (nodes) {
					graph.select(nodes);
				}
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
