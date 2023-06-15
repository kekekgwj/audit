import * as X6 from '@antv/x6';
import React, { useRef, forwardRef, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Selection } from '@antv/x6-plugin-selection';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Divider, message, Form, Input } from 'antd';
import { Dnd } from '@antv/x6-plugin-dnd';
import { LeftOutlined } from '@ant-design/icons';
import { saveAsAuditProject } from '@/api/dataAnalysis/graph';
import CustomDialog from '@/components/custom-dialog';

import classes from './graph.module.less';
import TableSourcePanel from '../components/TableSourcePanel';
import {
	IImageShapes,
	IImageTypes,
	getLabelLength,
	handleValidateNode,
	imageShapes,
	ports,
	syncData,
	validateConnectionRule
} from './utils';
import { GraphContext, useGraphPageInfo, useNodeConfigValue } from './hooks';

interface Props {
	className?: string;
	container?: HTMLDivElement;
	children?: ReactNode;
	openMessage: (error: string) => void;
}

export const Graph = forwardRef((props, ref) => {
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
	const isPublicTemplate = pathName === '审计模板';
	const [form] = Form.useForm();
	const {
		getConfigValue,
		saveConfigValue,
		resetConfigValue,
		getAllConfigs,
		setAllConfigs,
		updateNodeConfigVersion,
		getLastestVersion
	} = useNodeConfigValue();
	// 初始化画布
	const initializeGraph = () => {
		const strictTemplate = isPublicTemplate
			? {
					interacting: false,
					translating: {
						restrict: true
					}
			  }
			: {};
		if (graphWrapperRef.current && containerRef.current && !graph) {
			const graph: X6.Graph = new X6.Graph({
				container: containerRef.current,
				autoResize: false,
				grid: true,
				width: graphWrapperRef.current.offsetWidth,
				height: graphWrapperRef.current.offsetHeight,
				...strictTemplate,
				mousewheel: {
					enabled: true,
					modifiers: ['ctrl', 'meta']
				},
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
						enabled: !isPublicTemplate,
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
	};
	// 初始化画布和dnd
	useEffect(() => {
		initializeGraph();
	}, [graph, other, ref]);

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
		}
	};

	const getLabelLength = (str: string) => {
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

	const NodeColorOptions = {
		CONNECT: ['#F8F9FA', '#24A36F'],
		FILTER: ['#24A36F', '#24A36F'],
		ORDER: ['#24A36F', '#24A36F'],
		GROUP: ['#24A36F', '#24A36F'],
		END: ['#FF8683', '#FF8683']
	};

	const startDrag = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		{ label, image, type, labelCn, activeImage }: IImageShapes
	) => {
		if (!graph) {
			return;
		}

		if (isPublicTemplate) {
			return;
		}

		const text = labelCn || label;
		let bgColor = '#fff';
		let textColor = '18181F';

		if (type !== IImageTypes.TABLE) {
			[bgColor, textColor] = NodeColorOptions[type];
		}

		const node = graph?.createNode({
			inherit: 'rect',
			width: type === IImageTypes.TABLE ? getLabelLength(text) + 40 : 36,
			height: type === IImageTypes.TABLE ? 38 : 58,
			label: text,
			markup: [
				{
					tagName: 'rect',
					selector: 'body'
				},
				// {
				// 	tagName: 'rect',
				// 	selector: 'item'
				// },
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
					stroke: type === IImageTypes.TABLE ? '#ccc' : 'transparent',
					fill: type === IImageTypes.TABLE ? '#fff' : 'transparent',
					strokeWidth: type === IImageTypes.TABLE ? 1 : 0,
					rx: 4,
					ry: 4,
					overflow: 'auto'
				},
				// item: {
				// 	fill: bgColor,
				// 	strokeWidth: 0,
				// 	rx: 4,
				// 	ry: 4,
				// 	width: 30,
				// 	height: 30,
				// 	y: 0,
				// 	x: 3
				// },
				img: {
					'xlink:href': type === IImageTypes.TABLE ? image : activeImage,
					width: type === IImageTypes.TABLE ? 20 : 30,
					height: type === IImageTypes.TABLE ? 20 : 30,
					y: type === IImageTypes.TABLE ? 10 : 0,
					x: type === IImageTypes.TABLE ? 6 : 3
				},
				label: {
					refX: 22,
					refY: 6,
					fontWeight: 400,
					color: textColor,
					lineHeight: '22px',
					textAnchor: 'left',
					textVerticalAnchor: 'top',
					fontSize: 14,
					x: type === IImageTypes.TABLE ? 12 : -18,
					y: type === IImageTypes.TABLE ? 10 : 30,
					fill: textColor
				},
				custom: {
					type: type,
					label: label,
					labelCn: labelCn
				}
			},
			ports: { ...ports }
		});
		dnd?.start(node, e.nativeEvent as any);
	};
	const syncGraph = () => {
		const allConfigs = getAllConfigs();
		const graphNodesID = graph?.getNodes().map((node) => node.id);
		const validConfig = {};
		graphNodesID?.forEach((id: string) => {
			const config = allConfigs[id];
			if (config) {
				validConfig[id] = config;
			}
		});

		syncData(projectId, graph, validConfig);
	};
	//保存为审计模板
	const saveAsAuditTem = () => {
		setOpenSave(true);
	};

	const handleSave = async () => {
		const canvasData = graph?.toJSON();
		const cellData = canvasData.cells?.filter((item, index) => {
			return item.shape == 'rect';
		});
		const typeArr = [];
		cellData.forEach((el) => {
			typeArr.push(el.attrs.custom.type);
		});

		if (!typeArr.includes('END')) {
			//必须包含end 否则不让保存
			message.error('必须包含结束组件');
			return;
		}
		const data = form.getFieldsValue();
		const params = {
			canvasJson: JSON.stringify({
				content: canvasData,
				configs: getAllConfigs()
			}),
			projectId,
			name: data.name
		};
		try {
			const res = await saveAsAuditProject(params);
			message.success('保存成功');
			setOpenSave(false);
			form.resetFields();
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
				getAllConfigs,
				syncGraph,
				setAllConfigs,
				isPublicTemplate,
				updateNodeConfigVersion,
				getLastestVersion
			}}
		>
			<div className={classes['top-breadcrumb']}>
				<div onClick={() => goBack && goBack()} className={classes['top-back']}>
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
							{imageShapes.map(({ label, image, type, activeImage }, index) => {
								return (
									<div
										style={{ display: 'flex', alignItems: 'center' }}
										key={type}
										onMouseDown={(e) =>
											startDrag(e, { label, image, type, activeImage })
										}
									>
										<img src={image}></img>
										<span style={{ marginLeft: '8px', pointerEvents: 'none' }}>
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
						<div className="x6-content" id="x6-graph" ref={containerRef}></div>
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
});
