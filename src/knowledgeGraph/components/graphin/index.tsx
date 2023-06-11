import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react';
import Graphin, {
	Behaviors,
	type GraphinData,
	type LegendChildrenProps
} from '@antv/graphin';

import { IGraphData } from '@/api/knowLedgeGraph/graphin';
import Legend from './legend';
import LeftEvent from './LeftEvent';
import RightMenu from './RightMenu';

import styles from './index.module.less';
import formatCustomEdges from './customEdge';
import formatCustomNodes from './customNode';
import FocusCenter from './FocusCenter';
import { onSetCenterID, useFocuseState } from '@/redux/store';
const { Hoverable } = Behaviors;
interface Props {
	data: IGraphData;
	refersh: boolean;
	updateData: (data: GraphinData) => void;
	onClose: () => void;
	id?: string;
}

const getCenterNode = ({ nodes }: Pick<IGraphData, 'nodes'>): string | null => {
	let centerNode = null;
	for (const node of nodes) {
		const { isCenter, id } = node;
		if (isCenter) {
			centerNode = id + '-node';
			break;
		}
	}
	return centerNode;
};

const formatGraphData = (data: IGraphData): GraphinData => {
	const { edges, nodes } = Object.assign({}, data);

	const customEdges = formatCustomEdges({ edges });
	const customNodes = formatCustomNodes({ nodes });

	return {
		edges: customEdges,
		nodes: customNodes
	};
};
interface IGraphContext {
	updateData: ((data: GraphinData) => void) | null;
	curData: Record<string, any> | null;
}
const GraphContext = createContext<IGraphContext>({
	updateData: null,
	curData: null
});
export const useGraphContext = () => {
	return useContext(GraphContext);
};
const GraphinCom = React.memo((props: Props) => {
	const { data, updateData, refersh } = props;
	const formatData = formatGraphData(data);
	const centerNode = getCenterNode({ nodes: data.nodes });
	onSetCenterID({ centerID: centerNode });
	const [key, setKey] = useState('');

	const curData = { ...data }; //当前图谱数据  穿透下一层时需要拼接数据
	const [width, setWidth] = useState(600);
	const graphinContainerRef = useRef<HTMLDivElement>();

	useEffect(() => {
		const rect = graphinContainerRef?.current?.getBoundingClientRect();
		setWidth(rect?.width as number);
	}, []);

	useEffect(() => {
		const rect = graphinContainerRef?.current?.getBoundingClientRect();
		setKey(`${rect?.width}`);
		setWidth(rect?.width as number);
	}, [refersh]);

	return (
		<div ref={graphinContainerRef} className={styles['graphin-box']}>
			<Graphin
				key={key}
				data={formatData}
				width={width}
				layout={{
					type: 'force',
					preventOverlap: true,
					nodeSize: 200,
					nodeSpacing: 50
				}}
			>
				<Legend bindType="node" sortKey="config.type">
					{(renderProps: LegendChildrenProps) => {
						return (
							<Legend.Node
								{...renderProps}
								onChange={(checkedValue, result) => {
									console.log(
										'click legend',
										checkedValue,
										result,
										renderProps
									);
								}}
							/>
						);
					}}
				</Legend>
				<LeftEvent />
				<GraphContext.Provider value={{ updateData, curData }}>
					<RightMenu />
				</GraphContext.Provider>
				<FocusCenter />
				<Hoverable bindType="node" />
			</Graphin>
		</div>
	);
});

export default GraphinCom;
