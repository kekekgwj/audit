import { message } from 'antd';
import AddNodeBehavior from './AddNodeBehavior';
import GraphExport from './ExportData';
import FromJSONBehavior from './FromJSONBehavior';
import NodeDetailPanel from './components/NodeDetailPanel';
import { Graph } from './lib/index';
import GraphWatchEvents from './GraphWatchEvents';

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
