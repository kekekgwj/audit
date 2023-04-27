export default [
	{
		url: '/dev-api/getRuleList',
		method: 'get',
		response: () => {
			return [
				{
					key: '1',
					ruleName: '可疑规则一',
					ruleUse: '西湖区湖底公园1号',
					id: '001'
				},
				{
					key: '2',
					ruleName: '可疑规则二',
					ruleUse: '西湖区湖底公园1号',
					id: '002'
				}
			];
		}
	}
];
