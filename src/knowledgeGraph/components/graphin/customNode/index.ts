import { IGraphData } from '@/api/knowLedgeGraph/graphin';
import { getCanvasText } from '@/utils/graphin';

const Colors: {
	[key: string]: Array<string>;
} = {
	中心节点: ['#E6697B ', '#E6697B ', '#18181F'],
	人: ['#E369E6', '#E369E6', '#18181F'],
	法人: ['#9CB2FF', '#9CB2FF', '#18181F'],
	科研项目: ['#38BDE8', '#38BDE8', '#18181F'],
	经费卡: ['#CA923E', '#CA923E', '#18181F'],
	部门: ['#E57637', '#E57637', '#18181F'],
	采购事项: ['#E4D26E', '#E4D26E', '#18181F'],
	合同: ['#759DD9', '#759DD9', '#18181F '],
	发票: ['#5ACBA9', '#5ACBA9', '#18181F'],
	资产: ['#24A36F', '#24A36F', '#18181F'],
	lightNode: ['#FF4242', '#FF4242', '#18181F'], //高亮节点
	noLightNode: ['#EBF3EF', '#EBF3EF', '#18181F'], //不高亮节点
	BASE: ['red', 'red', '#18181F'],
	Company: ['#E6697B', '#E6697B', '#18181F'],
	Person: ['#EBF3EF', '#EBF3EF', '#18181F'],
	Property: ['#708FFF', '#708FFF', '#18181F'],
	Recipient: ['#24A36F', '#24A36F', '#18181F']
};
export const nodeSequence = Object.keys(Colors);
// 获取 stroke、FILL、
export const getColorByType = (type: string): string[] => {
	return Colors[type] ? Colors[type] : Colors['BASE'];
};
// legend的颜色
export const getFillColorByType = (type: string): string => {
	return (getColorByType(type)[0] as string) || '#000';
};

const formatCustomNodes = ({ nodes }: Pick<IGraphData, 'nodes'>) => {
	const averageScore =
		nodes.reduce((acc, curr) => acc + (curr?.score || 0), 0) / nodes.length;

	const formatNodes = nodes.map((node) => {
		const { type, score, communityId, id, isCenter = false, labels } = node;

		const [strokeColor, fillColor, labelColor] = getColorByType(
			isCenter ? '中心节点' : type
		);

		const size = score
			? Math.min(Math.max((score / averageScore) * 200, 100), 200)
			: 100;
		const labelStr = labels.join('/');
		const [str] = getCanvasText(labelStr, 12, size);
		return {
			...node,
			id: id + '-node',
			comboId: communityId,
			type: 'graphin-circle',
			style: {
				label: {
					// value: label,
					value: str,
					fontSize: 12,
					fontWeight: 500,
					x: 0,
					y: 6,
					textAlign: 'center',
					textBaseline: 'middle',
					fill: labelColor,
					cursor: 'pointer'
				},
				keyshape: {
					stroke: strokeColor,
					fill: fillColor,
					fillOpacity: 1,
					opacity: 1,
					size: size,
					cursor: 'pointer'
				},
				halo: {
					visible: false
				}
			},
			config: {
				// type
				type: isCenter ? '中心节点' : type
			}
		};
	});
	return formatNodes;
};

export default formatCustomNodes;
