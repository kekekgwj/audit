import Graphin from '@antv/graphin';
import { getCanvasText } from '@/utils/graphin';

const Colors: {
	[key: string]: Array<string>;
} = {
	BASE: ['red', 'red', '#fff'],
	Company: ['#E6697B', '#E6697B', '#fff'],
	Person: ['#EBF3EF', '#EBF3EF', '#000'],
	Property: ['#708FFF', '#708FFF', '#fff'],
	Recipient: ['#24A36F', '#24A36F', '#fff'],
	人: ['#E369E6', '#E369E6', '#fff'],
	法人: ['#9CB2FF', '#9CB2FF', '#fff'],
	科研项目: ['#38BDE8', '#38BDE8', '#fff'],
	经费卡: ['#CA923E', '#CA923E', '#fff'],
	部门: ['#E57637', '#E57637', '#fff'],
	采购项目: ['#E4D26E', '#E4D26E', '#fff'],
	合同: ['#759DD9', '#759DD9', '#fff'],
	发票: ['#5ACBA9', '#5ACBA9', '#fff'],
	资产: ['#24A36F', '#24A36F', '#fff'],
	lightNode: ['#f00', '#f00', '#fff'], //高亮节点
	noLightNode: ['#EBF3EF', '#EBF3EF', '#fff'] //不高亮节点
};

// 获取 stroke、FILL、
const getColorByType = (type: string): string[] => {
	return Colors[type] ? Colors[type] : Colors['BASE'];
};
// legend的颜色
export const getFillColorByType = (type: string): string => {
	return (getColorByType(type)[0] as string) || '#000';
};
export default () => {
	Graphin.registerNode(
		'Base',
		{
			// 响应状态变化
			setState(name, value, item) {
				const group = item.getContainer();
				const shape = group.get('children')[0]; // 顺序根据 draw 时确定
				if (name === 'selected') {
					if (value) {
						shape.attr('stroke', 'blue');
					} else {
						shape.attr('stroke', '#E6697B');
					}
				}
			},
			options: {
				style: {},
				stateStyles: {
					hover: {},
					selected: {}
				}
			},
			draw(cfg, group) {
				console.log('config', cfg.config);
				const { type, size } = cfg.config;
				const [strokeColor, fillColor, labelColor] = getColorByType(type);
				// 设置自定义节点图例
				cfg.style.keyshape = {
					stroke: strokeColor,
					fill: fillColor,
					fillOpacity: 1
				};

				const [label] = getCanvasText(cfg.label, 12, size);

				const keyshape = group.addShape('circle', {
					attrs: {
						r: size / 2,
						fill: fillColor,
						strokeColor: strokeColor,
						cursor: 'pointer'
					},
					draggable: true,
					name: 'node1-body'
				});

				// label样式
				group.addShape('text', {
					attrs: {
						fontSize: 12,
						x: 0,
						y: 0,
						textAlign: 'center',
						textBaseline: 'middle',
						text: label,
						fill: labelColor,
						cursor: 'pointer'
					},
					draggable: true,
					name: 'node1-name'
				});
				return keyshape;
			}
		},
		'single-node'
	);
};
