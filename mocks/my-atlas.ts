export default [
	{
		url: '/dev-api/myAltasList',
		method: 'get',
		response: () => {
			return [
				{
					key: '1',
					name: '图谱名称1',
					createTime: '2023-04-26',
					id: '111'
				},
				{
					key: '2',
					name: '图谱名称2',
					createTime: '2023-04-26',
					id: '222'
				}
			];
		}
	}
];
