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
import { Divider, message, Form, Input } from 'antd';
import { Dnd } from '@antv/x6-plugin-dnd';
import { LeftOutlined } from '@ant-design/icons';
import {
	saveAsAuditProject,
	getProjectCanvas,
	getAuditProjectCanvas
} from '@/api/dataAnalysis/graph';
import CustomDialog from '@/components/custom-dialog';

interface IGraphContext extends IGraphConfig {
	graph: X6.Graph | null;
	startDrag: (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		{ label, image, type }: IImageShapes
	) => void;
	projectID: number | null;
}
interface IGraphConfig {
	getConfigValue: (id: string) => any;
	saveConfigValue: (id: string, value: any) => void;
	resetConfigValue: (id: string) => void;
	getAllConfigs: () => void;
	setAllConfigs: (value: any) => void;
}
export const useGraph = () => {
	const { graph } = useContext(GraphContext) || {};
	return graph;
};
export const useGraphID = () => {
	const { projectID } = useContext(GraphContext) || {};
	return projectID;
};

export const useGraphContext = () => {
	return useContext(GraphContext) || {};
};

export const useNodeConfigValue: () => IGraphConfig = () => {
	const ref = React.useRef<Record<string, object>>({});

	const getConfigValue = useCallback((id: string) => {
		console.log('ref.current', ref.current);
		if (ref.current) {
			return ref.current[id];
		} else {
			null;
		}
	}, []);
	const saveConfigValue = useCallback((id: string, value: any) => {
		ref.current[id] = value;
	}, []);
	const resetConfigValue = useCallback((id: string) => {
		saveConfigValue(id, null);
	}, []);
	const getAllConfigs = () => {
		return ref.current;
	};
	const setAllConfigs = (value: any) => {
		ref.current = value;
	};
	return {
		getConfigValue,
		saveConfigValue,
		resetConfigValue,
		getAllConfigs,
		setAllConfigs
	};
};
export const GraphContext = createContext<IGraphContext>({
	graph: null,
	startDrag: function (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		{ label, image, type }: IImageShapes
	): void {
		throw new Error('Function not implemented.');
	},
	projectID: null,
	getConfigValue: function (id: string) {
		throw new Error('Function not implemented.');
	},
	saveConfigValue: function (id: string, value: any): void {
		throw new Error('Function not implemented.');
	},
	resetConfigValue: function (id: string): void {
		throw new Error('Function not implemented.');
	},
	getAllConfigs: function (): void {
		throw new Error('Function not implemented.');
	},
	setAllConfigs: function (value: any): void {
		throw new Error('Function not implemented.');
	}
});
import classes from './graph.module.less';
import TableSourcePanel from '../components/TableSourcePanel';
import {
	IImageShapes,
	IImageTypes,
	getNodeTypeById,
	handleValidateNode,
	imageShapes,
	syncData,
	validateConnectionRule
} from './utils';
import { useGraphPageInfo } from './hooks';
import { config } from 'process';
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
		const [openSave, setOpenSave] = useState<boolean>(false);
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
		const { goBack, pathName, templateName, projectId } = useGraphPageInfo();
		const [form] = Form.useForm();
		const {
			getConfigValue,
			saveConfigValue,
			resetConfigValue,
			getAllConfigs,
			setAllConfigs
		} = useNodeConfigValue();
		// 初始化画布和dnd
		useEffect(() => {
			if (graphWrapperRef.current && containerRef.current && !graph) {
				const graph: X6.Graph = new X6.Graph({
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
								tools: {
									name: 'button-remove',
									args: { distance: -40 }
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
			//初始化画布元素
			// if (projectId) {
			// 	getProjectCanvas({ projectId }).then((res) => {
			// 		if (res.canvasJson) {
			// 			const data = JSON.parse(res.canvasJson);
			// 			graph.fromJSON(data.content);
			// 		}
			// 	});
			// }
		}, [graph, other, ref]);
		useEffect(() => {
			if (!graph || !projectId) {
				return;
			}
			// 这里要分我的模板和审计模板
			if (pathName == '我的模板') {
				(async () => {
					const res = await getProjectCanvas({ projectId });
					const { canvasJson } = res;
					const { content, configs } = JSON.parse(canvasJson);
					graph.fromJSON(content);
					setAllConfigs(configs || {});
				})();
			} else if (pathName == '审计模板') {
				(async () => {
					const res = await getAuditProjectCanvas({
						auditProjectId: projectId
					});
					const { canvasJson } = res;
					const { content, configs } = JSON.parse(canvasJson);
					graph.fromJSON(content);
					setAllConfigs(configs || {});
				})();
			}
		}, [projectId, graph]);
		// 监听画布尺寸
		useEffect(() => {
			window.addEventListener('resize', handleResize);
			return () => window.removeEventListener('resize', handleResize);
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
					if (!cell || !cell.position) {
						return;
					}
					const { x, y } = cell.position;
					maxOffsetWidth = Math.max(x + graphOffsetWidth, maxOffsetWidth);
					maxoffsetHeight = Math.max(y + graphOffsetHeight, maxoffsetHeight);
				});
				graph.resize(maxOffsetWidth, maxoffsetHeight);
				// graph?.resize(containWidth, containHeight);
			}
		};

		const startDrag = (
			e: React.MouseEvent<HTMLDivElement, MouseEvent>,
			{ label, image, type, labelCn }: IImageShapes
		) => {
			if (!graph) {
				return;
			}
			const node = graph?.createNode({
				inherit: 'rect',
				width: type === IImageTypes.TABLE ? label.length * 14 + 40 : 36,
				// height: 38,
				height: type === IImageTypes.TABLE ? 38 : 58,
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
						x: type === IImageTypes.TABLE ? 12 : -18,
						y: type === IImageTypes.TABLE ? 10 : 30,
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

		//保存为审计模板
		const saveAsAuditTem = () => {
			setOpenSave(true);
			form.resetFields();
		};

		const handleSave = async () => {
			const data = form.getFieldsValue();
			try {
				const res = await saveAsAuditProject({ projectId, name: data.name });
				message.success('保存成功');
				setOpenSave(false);
			} catch (e) {
				console.error(e);
			}
		};

		const handleCancel = () => {
			setOpenSave(false);
		};

		return (
			<GraphContext.Provider
				value={{
					graph,
					startDrag,
					projectID: projectId,
					getConfigValue,
					saveConfigValue,
					resetConfigValue,
					getAllConfigs
				}}
			>
				<div className={classes['top-breadcrumb']}>
					<div
						onClick={() => goBack && goBack()}
						className={classes['top-back']}
					>
						<span>
							<LeftOutlined />
							<span style={{ marginLeft: '8px', cursor: 'pointer' }}>返回</span>
						</span>
						<span style={{ marginLeft: '8px' }}>{pathName}</span>
					</div>
					<div className={classes['top-template-name']}>
						<span>/</span>
						<span style={{ marginLeft: '8px' }}>{templateName}</span>
					</div>
				</div>
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
									saveAsAuditTem();
								}}
							>
								保存为审计模板
							</div>
							<div
								className="x6-dnd"
								ref={DndContainerRef}
								style={{
									position: 'relative',
									width: '440px',
									height: '44px',
									display: 'flex',
									alignItems: 'center'
								}}
							>
								<span
									style={{ fontSize: 14, fontWeight: 'bold', marginRight: 30 }}
								>
									工具栏
								</span>
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
				<CustomDialog
					open={openSave}
					width={600}
					onOk={handleSave}
					onCancel={handleCancel}
				>
					<Form
						form={form}
						labelCol={{ span: 4 }}
						wrapperCol={{ span: 20 }}
						labelAlign="left"
					>
						<Form.Item
							label="模板名称"
							name="name"
							rules={[{ required: true, message: '请输入名称' }]}
						>
							<Input />
						</Form.Item>
					</Form>
				</CustomDialog>
			</GraphContext.Provider>
		);
	}
);

export const useGraphInstance = () => useContext(GraphContext);
