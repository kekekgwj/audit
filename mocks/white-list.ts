export default [
	{
		url: '/dev-api/getWhiteList',
		method: 'get',
		response: () => {
			return [
				{
					key: '1',
					name: '图谱一',
					type: '关联关系图普',
					createTime: '2023-04-25',
					id: '01'
				},
				{
					key: '2',
					name: '图谱二',
					type: '关联关系图普',
					createTime: '2023-04-25',
					id: '02'
				}
			];
		}
	}
];
