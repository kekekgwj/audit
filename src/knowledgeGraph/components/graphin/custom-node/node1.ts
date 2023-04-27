/**
 * 自定义节点,示例
 * todo
 * @author dongdongjie
 */

import Graphin from '@antv/graphin';
import { getCanvasText } from '@/utils/graphin';

export default () => {
	Graphin.registerNode(
		'custom-node',
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
				cfg.style.keyshape = {
					stroke: 'red',
					fill: 'red',
					fillOpacity: 1
				};

				const [label] = getCanvasText(cfg.label, 12, 100);

				const keyshape = group.addShape('circle', {
					attrs: {
						r: 60,
						fill: '#E6697B'
					},
					draggable: true,
					name: 'node1-body'
				});
				group.addShape('text', {
					attrs: {
						fontSize: 12,
						x: 0,
						y: 0,
						textAlign: 'center',
						textBaseline: 'middle',
						text: label,
						fill: '#fff'
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
