import { appendQueryParams, get, post } from '@/utils/request';
const env = import.meta.env;
const { VITE_API_PREFIX: API_PREFIX } = env;
// 可以规则列表
export function getSuspiciousRule(data: any) {
	return get(
		appendQueryParams(API_PREFIX + '/blade-tool/graphAnalysis/getRules', data)
	);
}
