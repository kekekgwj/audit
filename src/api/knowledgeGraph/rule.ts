import { appendQueryParams, get, post } from '@/utils/request';
const env = import.meta.env;
const { VITE_API_PREFIX: API_PREFIX } = env;
// 可以规则列表
interface RuleProps {
	name: string;
	current: number;
	size: number;
}
export function getSuspiciousRule(data: RuleProps) {
	return get(
		appendQueryParams(API_PREFIX + '/blade-tool/graphAnalysis/getRules', data)
	);
}

//使用可以规则 生成图谱
interface GraphByRuleProps {
	auditRuleParams: string;
}
export function getGraphByRule(data: GraphByRuleProps) {
	return get(
		appendQueryParams(
			API_PREFIX + '/blade-tool/graphAnalysis/getGraphByRule',
			data
		)
	);
}

// 可疑规则主体校验
export function checkNodeByRule(data: {
	ruleId: number | string;
	value: string;
}) {
	return get(
		appendQueryParams(
			API_PREFIX + '/blade-tool/graphAnalysis/checkNodeByRule',
			{
				...data
			}
		)
	);
}
