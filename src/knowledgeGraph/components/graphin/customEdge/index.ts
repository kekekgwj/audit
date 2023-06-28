import { IGraphData } from '@/api/knowLedgeGraph/graphin';
import { transformToNormalDistribution } from '@/utils/graphin';
import { Utils } from '@antv/graphin';
const formatCustomEdges = ({ edges }: Pick<IGraphData, 'edges'>) => {
	const originSimilarity = edges.map((edge) =>
		edge.similarity ? edge.similarity : 0
	);

	const transformedData = transformToNormalDistribution(originSimilarity);

	const formatEdges = edges.map((edge, index) => {
		const { type, similarity, id, source, target } = edge;
		const defaultType = 'graphin-line';
		const customID = id + '-edge';
		const customLineWidth = similarity
			? (1 + transformedData[index]) * 4 + 1
			: 1;

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
