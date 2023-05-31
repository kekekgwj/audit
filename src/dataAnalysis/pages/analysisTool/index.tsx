// import React, { useEffect, useRef } from 'react';
// // import { preWork } from './components';
// import { Graph } from '@antv/x6';
// // 使用 CDN 引入时暴露了 X6 全局变量
// // const { Graph } = X6
// const data = {
// 	// 节点
// 	nodes: [
// 		{
// 			id: 'node1', // String，可选，节点的唯一标识
// 			x: 40, // Number，必选，节点位置的 x 值
// 			y: 40, // Number，必选，节点位置的 y 值
// 			width: 80, // Number，可选，节点大小的 width 值
// 			height: 40, // Number，可选，节点大小的 height 值
// 			label: 'hello' // String，节点标签
// 		},
// 		{
// 			id: 'node2', // String，节点的唯一标识
// 			x: 160, // Number，必选，节点位置的 x 值
// 			y: 180, // Number，必选，节点位置的 y 值
// 			width: 80, // Number，可选，节点大小的 width 值
// 			height: 40, // Number，可选，节点大小的 height 值
// 			label: 'world' // String，节点标签
// 		}
// 	],
// 	// 边
// 	edges: [
// 		{
// 			source: 'node1', // String，必须，起始节点 id
// 			target: 'node2' // String，必须，目标节点 id
// 		}
// 	]
// };
// const DataAnalysis: React.FC = () => {
// 	const graphRef = useRef(null);

// 	useEffect(() => {
// 		graphRef.current = new Graph({
// 			container: document.getElementById('container'),
// 			width: 800,
// 			height: 600
// 		});
// 		graphRef.current = graphRef?.current?.fromJSON(data);
// 	}, []);
// 	return <div id="container">123</div>;
// };

// export default DataAnalysis;
import { message } from 'antd';
import AddNodeBehavior from './AddNodeBehavior';
import GraphExport from './ExportData';
import FromJSONBehavior from './FromJSONBehavior';
import NodeDetailPanel from './components/NodeDetailPanel';
import { Graph, useGraphInstance, useGraphState } from './lib/index';
import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const X6Graph = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { nodes, setNodes, edges, setEdges, graph: gRef } = useGraphState();
	const [messageApi, contextHolder] = message.useMessage();
	const key = 'graph';
	const pathName = location.state?.path; //上一级界面名称
	const templateName = location.state?.name; //模板名称
	const projectId = location.state?.id;
	const openMessage = (error: string) => {
		messageApi.open({
			key,
			type: 'error',
			content: error,
			duration: 2
		});
	};
	const goBack = () => {
		navigate(-1);
	};
	return (
		<>
			{contextHolder}
			<Graph
				openMessage={openMessage}
				goBack={goBack}
				pathName={pathName}
				templateName={templateName}
				projectId={projectId}
			>
				{/* <AddNodeBehavior /> */}
				{/* <FromJSONBehavior />
				<GraphExport /> */}
				<NodeDetailPanel />
			</Graph>
		</>
	);
};
export default X6Graph;
