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
import { Stencil } from '@antv/x6-plugin-stencil';
import { Snapline } from '@antv/x6-plugin-snapline';

const GraphContext = createContext<X6.Graph | null>(null);

interface Props {
	className?: string;
	container?: HTMLDivElement;
	children?: ReactNode;
}

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
		const imageShapes = [
			{
				label: 'Client',
				image:
					'https://gw.alipayobjects.com/zos/bmw-prod/687b6cb9-4b97-42a6-96d0-34b3099133ac.svg'
			},
			{
				label: 'Http',
				image:
					'https://gw.alipayobjects.com/zos/bmw-prod/dc1ced06-417d-466f-927b-b4a4d3265791.svg'
			},
			{
				label: 'Api',
				image:
					'https://gw.alipayobjects.com/zos/bmw-prod/c55d7ae1-8d20-4585-bd8f-ca23653a4489.svg'
			},
			{
				label: 'Sql',
				image:
					'https://gw.alipayobjects.com/zos/bmw-prod/6eb71764-18ed-4149-b868-53ad1542c405.svg'
			},
			{
				label: 'Clound',
				image:
					'https://gw.alipayobjects.com/zos/bmw-prod/c36fe7cb-dc24-4854-aeb5-88d8dc36d52e.svg'
			},
			{
				label: 'Mq',
				image:
					'https://gw.alipayobjects.com/zos/bmw-prod/2010ac9f-40e7-49d4-8c4a-4fcf2f83033b.svg'
			}
		];

		useEffect(() => {
			if (containerRef.current && !graph) {
				const graph = new X6.Graph({
					container: containerRef.current,
					...other
				});
				graph.use(
					new Snapline({
						enabled: true,
						sharp: true
					})
				);
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
						stencilGraphWidth: 200,
						stencilGraphHeight: 180,
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
							}
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

					console.log(imageNodes);
					stencil.load(imageNodes, 'group1');
					stencilRef?.current?.appendChild(stencil.container);
				}
			}
		}, [graph, other, ref]);

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
					<div className="x6-content" ref={containerRef}></div>

					{!!graph && children}
				</GraphContext.Provider>
			</div>
		);
	}
);

export const useGraphInstance = () => useContext(GraphContext);
