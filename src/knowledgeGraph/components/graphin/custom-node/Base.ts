import Graphin from '@antv/graphin';
import { getCanvasText } from '@/utils/graphin';

const Colors = {
	BASE: ['red', 'red', '#fff']
};

// 获取 stroke、FILL、
const getColorByType = (type: string): string[] => {
	return Colors[type] ? Colors[type] : Colors['BASE'];
};
export default () => {
	Graphin.registerNode(
		'Base',
		{
			// 响应状态变化
			setState(name, value, item) {
				const group = item.getContainer();
				console.log(group.get('children'), 1777171717);
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
				// 设置自定义节点图例
				console.log('config', cfg);
				const config = cfg.config;
				const { type, size } = config;
				const [strokeColor, fillColor, labelColor] = getColorByType(type);

				const [label] = getCanvasText(cfg.label, 12, 100);

				const keyshape = group.addShape('circle', {
					attrs: {
						r: size,
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
