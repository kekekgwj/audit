/**
 * 自定义节点,示例
 * todo
 * @author dongdongjie
 */

import Graphin from '@antv/graphin';

export default () => {
	Graphin.registerNode(
		'custom-node',
		{
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
				const keyshape = group.addShape('circle', {
					attrs: {
						r: 40,
						fill: 'red'
					},
					draggable: true,
					name: 'node1-body'
				});
				group.addShape('text', {
					attrs: {
						fontSize: 12,
						x: 0,
						y: 0,
						text: cfg.id,
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
