import Graphin from '@antv/graphin';

export default () => {
	Graphin.registerEdge('Base', {
		draw(cfg, group) {
			const { type, size } = cfg.config;
			const { startPoint, endPoint } = cfg;
			const shape = group.addShape('path', {
				attrs: {
					stroke: '#BABABA',
					lineWidth: 1 + size * 4,
					endArrow: {
						path: 'M 0,0 L 8,4 L 8,-4 Z',
						fill: '#BABABA'
					},
					path: [
						['M', startPoint.x, startPoint.y],
						['L', endPoint.x, endPoint.y]
					]
				},
				name: 'path-shape'
			});

			const midPoint = shape.getPoint(0.5);

			group.addShape('text', {
				attrs: {
					fontSize: 12,
					x: midPoint.x,
					y: midPoint.y,
					text: type,
					fill: '#ccc'
				},
				draggable: true,
				name: 'node1-name'
			});

			return shape;
		}
	});
};
