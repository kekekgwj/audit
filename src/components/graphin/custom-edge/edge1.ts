import Graphin from '@antv/graphin';

export default () => {
	Graphin.registerEdge('custom-edge', {
		draw(cfg, group) {
			const { startPoint, endPoint } = cfg;
			const shape = group.addShape('path', {
				attrs: {
					stroke: '#ccc',
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
					text: cfg.label,
					fill: '#ccc'
				},
				draggable: true,
				name: 'node1-name'
			});

			return shape;
		}
	});
};
