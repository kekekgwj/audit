import React from 'react';
import { useRef, useState, useMemo, useEffect, useContext } from 'react';
import './layoutStyle.less';
import LayoutSelector from './layoutSelector';
import networkLayouts from './layoutsOptions';
import { useSelector, useDispatch } from 'react-redux';
import Graphin, { GraphinContext } from '@antv/graphin';
import { Form, Input, Button, Radio, Select } from 'antd';

interface Props {
	type: string;
	changeLayout: (layout: any) => void;
	changeDefaultEdge: (layout: any) => void;
}

// 默认全局样式
const DefaultStyle = React.memo((prop: Props) => {
	const { graph, apis } = useContext(GraphinContext);
	const [form] = Form.useForm();
	const { changeDefaultEdge } = prop;
	const { setFieldsValue, resetFields } = form;
	useEffect(() => {
		setFieldsValue({
			stroke: '',
			lineWidth: 1
		});
	}, [setFieldsValue]);

	const handleTransform = (res) => {
		console.log(res, 31111);
		if (changeDefaultEdge) {
			const newData = {
				style: {
					label: {
						value: ''
					},
					keyshape: {
						lineWidth: Number(res.lineWidt),
						stroke: res.stroke
					}
				}
			};
			changeDefaultEdge(newData);
		}
	};

	return (
		<div className="default-style-box">
			<Form
				form={form}
				labelCol={{ span: 4 }}
				wrapperCol={{ span: 14 }}
				layout="horizontal"
				style={{ maxWidth: 600 }}
				onFinish={(res: any) => {
					handleTransform(res);
				}}
			>
				<div className="default-node-style">
					<div>默认节点样式</div>
					<Form.Item label="颜色" name="nodeColor">
						<Input />
					</Form.Item>
					<Form.Item label="大小" name="nodeSize">
						<Input />
					</Form.Item>
				</div>

				<div className="default-node-style">
					<div>默认边样式</div>
					<Form.Item label="颜色" name="stroke">
						<Input />
					</Form.Item>
					<Form.Item label="线条宽度" name="lineWidth">
						<Input />
					</Form.Item>
				</div>

				<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
					<Button type="primary" htmlType="submit">
						设置
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
});

// 节点详情
const NodeDetail = React.memo(() => {
	const nodeInfo = useSelector((state) => state);
	const { graph, apis } = useContext(GraphinContext);
	const [form] = Form.useForm();
	const { setFieldsValue, resetFields } = form;
	const el = graph.findById(nodeInfo.id) || graph.findById('node-0');
	const model = el?.getModel();
	useEffect(() => {
		console.log(model, 2444444);
		setFieldsValue({
			label: model.style?.label.value || '',
			size: model.style?.keyshape.size || ''
		});
	}, [nodeInfo, setFieldsValue]);

	const changeNodeStyle = (res) => {
		console.log(res);
		graph.updateItem(nodeInfo.id, {
			style: {
				label: {
					value: res.label
				},
				keyshape: {
					size: res.size - 0
				}
			}
		});
	};

	return (
		<div>
			<div className="node-detail-box">
				<div className="detail-item">
					<div>节点id</div>
					<div>{model.id}</div>
				</div>
			</div>
			<div className="node-style-box">
				<Form
					form={form}
					labelCol={{ span: 4 }}
					wrapperCol={{ span: 14 }}
					layout="horizontal"
					style={{ maxWidth: 600 }}
					onFinish={(res: any) => {
						changeNodeStyle(res);
					}}
				>
					<Form.Item label="节点描述" name="label">
						<Input />
					</Form.Item>
					<Form.Item label="节点大小" name="size">
						<Input />
					</Form.Item>
					<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
						<Button type="primary" htmlType="submit">
							设置
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
});
NodeDetail.displayName = 'NodeDetail';

// 边详情
const EdgeDetail = React.memo(() => {
	const graphinInfo = useSelector((state) => state);
	const { graph, apis } = useContext(GraphinContext);
	const [form] = Form.useForm();
	const { setFieldsValue, resetFields } = form;
	const el = graph.findById(graphinInfo.id) || graph.findById('edge-0-1');
	const model = el?.getModel();
	useEffect(() => {
		console.log(model, 9111111);
		setFieldsValue({
			label: model.style?.label.value || ''
		});
	}, [graphinInfo, el, model]);
	const changeEdgeStyle = (res) => {
		graph.updateItem(graphinInfo.id, {
			style: {
				label: {
					value: res.label
				}
			}
		});
	};

	return (
		<div>
			<div className="node-detail-box">
				<div className="detail-item">
					<div>边起点</div>
					<div>{model.source}</div>
				</div>
				<div className="detail-item">
					<div>边终点</div>
					<div>{model.target}</div>
				</div>
			</div>
			<div className="edge-style-box">
				<Form
					form={form}
					labelCol={{ span: 4 }}
					wrapperCol={{ span: 14 }}
					layout="horizontal"
					style={{ maxWidth: 600 }}
					onFinish={(res: any) => {
						changeEdgeStyle(res);
					}}
				>
					<Form.Item label="边描述" name="label">
						<Input />
					</Form.Item>
					<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
						<Button type="primary" htmlType="submit">
							设置
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
});
EdgeDetail.displayName = 'EdgeDetail';

//布局样式组件
const LayoutStyle = React.memo((prop: Props) => {
	const { changeLayout, type, changeDefaultEdge } = prop;
	const elInfo = useSelector((state) => state);
	useEffect(() => {
		console.log(elInfo, 116666);
	}, [elInfo]);
	const curComponent = elInfo.type == 'node' ? <NodeDetail /> : <EdgeDetail />;
	return (
		<div className="style-content">
			<div className="node-detail">
				<div className="style-title">默认样式</div>
				<DefaultStyle changeDefaultEdge={changeDefaultEdge}></DefaultStyle>
			</div>
			<div className="node-detail">
				<div className="style-title">
					{elInfo.type == 'node' ? '节点详情' : '边详情'}
				</div>
				{curComponent}
			</div>
			<div className="layout-setting">
				<div className="style-title">布局设置</div>
				<div>
					<LayoutSelector
						type={type}
						layouts={networkLayouts}
						onChange={changeLayout}
					/>
				</div>
			</div>
		</div>
	);
});

export default LayoutStyle;
