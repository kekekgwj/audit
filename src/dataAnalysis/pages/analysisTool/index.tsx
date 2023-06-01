import { message } from 'antd';
import AddNodeBehavior from './AddNodeBehavior';
import GraphExport from './ExportData';
import FromJSONBehavior from './FromJSONBehavior';
import NodeDetailPanel from './components/NodeDetailPanel';
import { Graph, useGraphInstance, useGraphState } from './lib/index';
import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GraphWatchEvents from './GraphWatchEvents';

const X6Graph = () => {
	const { nodes, setNodes, edges, setEdges, graph: gRef } = useGraphState();
	const [messageApi, contextHolder] = message.useMessage();
	const key = 'graph';

	const openMessage = (error: string) => {
		messageApi.open({
			key,
			type: 'error',
			content: error,
			duration: 2
		});
	};

	return (
		<>
			{contextHolder}
			<Graph openMessage={openMessage}>
				{/* <AddNodeBehavior /> */}
				{/* <FromJSONBehavior />
				<GraphExport /> */}
				<GraphWatchEvents />
				<NodeDetailPanel />
			</Graph>
		</>
	);
};
export default X6Graph;
