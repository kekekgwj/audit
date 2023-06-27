import { message } from 'antd';
// import AddNodeBehavior from './AddNodeBehavior';
// import GraphExport from './ExportData';
import FromJSONBehavior from './FromJSONBehavior';
import NodeDetailPanel from './components/NodeDetailPanel';
import { Graph } from './lib/index';
import GraphWatchEvents from './GraphWatchEvents';
import { useEffect } from 'react';
import { onClickCloseConfigPanel } from '@/redux/store';

const X6Graph = () => {
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
	useEffect(() => {
		return () => {
			onClickCloseConfigPanel();
		};
	}, []);

	return (
		<>
			{contextHolder}
			<Graph openMessage={openMessage}>
				{/* <AddNodeBehavior /> */}
				<FromJSONBehavior />
				{/* <GraphExport /> */}
				<GraphWatchEvents />
				<NodeDetailPanel />
			</Graph>
		</>
	);
};
export default X6Graph;
