export default [
	{
		url: '/dev-api/getBodyGraphin',
		method: 'get',
		response: () => {
			return {
				nodes: [
					{
						id: 'node-0',
						label: '我是node0',
						type: 'custom-node',
						typeName: '主体'
					},
					{
						id: 'node-1',
						label: '我是node1',
						type: 'custom-node',
						typeName: '供应商'
					},
					{
						id: 'node-2',
						label: '我是node2',
						type: 'custom-node',
						typeName: '供应商'
					},
					{
						id: 'node-3',
						label: '我是node3',
						type: 'custom-node',
						typeName: '供应商'
					},
					{
						id: 'node-4',
						label: '我是node0',
						type: 'custom-node',
						typeName: '供应商'
					}
				],
				edges: [
					{
						id: 'edge-0-1',
						source: 'node-0',
						target: 'node-1',
						type: 'custom-edge',
						label: '我是边1'
					},
					{
						id: 'edge-0-3',
						source: 'node-0',
						target: 'node-3',
						type: 'custom-edge',
						label: '我是边4'
					},
					{
						id: 'edge-3-4',
						source: 'node-3',
						target: 'node-4',
						type: 'custom-edge',
						label: '我是边5'
					},
					{
						id: 'edge-1-2',
						source: 'node-1',
						target: 'node-2',
						type: 'custom-edge',
						label: '我是边6'
					},
					{
						id: 'edge-0-2',
						source: 'node-0',
						target: 'node-2',
						type: 'custom-edge',
						label: '我是边7'
					}
				]
			};
		}
	}
];
