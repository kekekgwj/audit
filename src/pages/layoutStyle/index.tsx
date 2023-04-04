import React from 'react';
import { useRef, useState, useMemo, useEffect } from 'react';
import './layoutStyle.less';
import LayoutSelector from './layoutSelector';
import networkLayouts from './layoutsOptions';
import { useSelector, useDispatch } from 'react-redux';
import {
	Form,
	Input,
	Button,
	Radio,
	Select,
	Cascader,
	DatePicker,
	InputNumber,
	TreeSelect,
	Switch,
	Checkbox,
	Upload
} from 'antd';

interface Props {
	type: string;
	changeLayout: (layout: any) => void;
}

// 节点详情
const NodeDetail = React.memo(() => {
	const nodeInfo = useSelector((state) => state);
	useEffect(() => {
		console.log(nodeInfo, 666666);
	}, [nodeInfo]);
	return (
		<div>
			<div>节点id</div>
			<div>{nodeInfo.id}</div>
		</div>
	);
});
NodeDetail.displayName = 'NodeDetail';

//布局样式组件
const LayoutStyle = React.memo((prop: Props) => {
	const { changeLayout, type } = prop;
	return (
		<div className="style-content">
			<div className="node-style">
				<div className="style-title">节点属性编码</div>
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
			<div className="node-detail">
				<div className="style-title">节点详情</div>
				<NodeDetail></NodeDetail>
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
