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
}

// 节点详情
const NodeDetail = React.memo(() => {
	const nodeInfo = useSelector((state) => state);
	const { graph, apis } = useContext(GraphinContext);
	// const el = graph?.findById(nodeInfo.id);
	// const [form] = Form.useForm();
	// const { setFieldsValue, resetFields } = form;
	useEffect(() => {
		// setFieldsValue({});
		// console.log(el, 26666666666666666);
	}, [nodeInfo]);
	return (
		<div>
			<div className="node-detail-box">
				<div className="detail-item">
					<div>节点id</div>
					<div>{nodeInfo.id}</div>
				</div>
				<div className="detail-item">
					<div>节点x</div>
					<div>{nodeInfo.x}</div>
				</div>
				<div className="detail-item">
					<div>节点y</div>
					<div>{nodeInfo.y}</div>
				</div>
			</div>
			<div classNmae="node-style-box">
				<Form
					labelCol={{ span: 4 }}
					wrapperCol={{ span: 14 }}
					layout="horizontal"
					style={{ maxWidth: 600 }}
				>
					<Form.Item label="节点描述" name="label">
						<Input />
					</Form.Item>
					<Form.Item label="属性">
						<Select>
							<Select.Option value="demo">Demo</Select.Option>
						</Select>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
});
NodeDetail.displayName = 'NodeDetail';

// 节点详情
const EdgeDetail = React.memo(() => {
	const graphinInfo = useSelector((state) => state);
	useEffect(() => {
		console.log(graphinInfo, 666666);
	}, [graphinInfo]);
	return (
		<div className="node-detail-box">
			<div className="detail-item">
				<div>边起点</div>
				<div>{graphinInfo.source}</div>
			</div>
			<div className="detail-item">
				<div>边终点</div>
				<div>{graphinInfo.target}</div>
			</div>
		</div>
	);
});
EdgeDetail.displayName = 'EdgeDetail';

//布局样式组件
const LayoutStyle = React.memo((prop: Props) => {
	const { changeLayout, type } = prop;
	return (
		<div className="style-content">
			<div className="node-detail">
				<div className="style-title">节点详情</div>
				<NodeDetail></NodeDetail>
			</div>
			<div className="node-detail">
				<div className="style-title">边详情</div>
				<EdgeDetail></EdgeDetail>
			</div>
			<div className="node-style">
				<div className="style-title">节点样式</div>
				<Form
					labelCol={{ span: 4 }}
					wrapperCol={{ span: 14 }}
					layout="horizontal"
					style={{ maxWidth: 600 }}
				>
					<Form.Item label="节点类型">
						<Select>
							<Select.Option value="demo">Demo</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item label="属性">
						<Select>
							<Select.Option value="demo">Demo</Select.Option>
						</Select>
					</Form.Item>
				</Form>
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
