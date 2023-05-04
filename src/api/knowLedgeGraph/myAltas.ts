import { appendQueryParams, get, post } from '@/utils/request';
const env = import.meta.env;
const { VITE_API_PREFIX: API_PREFIX } = env;

export function getMyAltasList() {
	return get(
		appendQueryParams(API_PREFIX + '/blade-tool/graphAnalysis/getMyGraph', {
			graphId: 1
		})
	);
}
