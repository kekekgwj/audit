import { IGraphData } from '@/api/knowLedgeGraph/graphin';
import { Utils } from '@antv/graphin';
const formatCustomEdges = ({ edges }: Pick<IGraphData, 'edges'>) => {
	const formatEdges = edges.map((edge) => {
		const { type, similarity, id, source, target } = edge;

		const defaultType = 'graphin-line';
		const customID = id + '-edge';
		const customLineWidth = 1 + (similarity || 0) * 4;
		const customLabel = type;
		const [customSourceNode, customTargetNode] = [source, target].map((v) =>
			v.concat('-node')
		);

		return {
			...edge,
			type: defaultType,
			id: customID,
			source: customSourceNode,
			target: customTargetNode,
			style: {
				label: {
					value: customLabel
				},
				keyshape: {
					lineWidth: customLineWidth
				}
			}
		};
	});
	const polyEdges = Utils.processEdges([...formatEdges]);
	return polyEdges;
};
export default formatCustomEdges;
