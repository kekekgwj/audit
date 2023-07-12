import { appendQueryParams, get, post, postFormData } from '@/utils/request';
const env = import.meta.env;
const { VITE_API_PREFIX: API_PREFIX } = env;

export const getTables = (queryType: 1 | 2) => {
	return get(
		appendQueryParams(API_PREFIX + '/blade-tool/dataAnalysis/getTables', {
			queryType: queryType
		})
	);
};

export const getMyTables = () => {
	return getTables(2);
};

export const getSystemTables = () => {
	return getTables(1);
};

interface QueryParams {
	keyword?: string;
	orderBy?: string | number;
}
export const getClassifiedTables = (data: QueryParams) => {
	return get(
		appendQueryParams(
			API_PREFIX + '/blade-tool/dataAnalysis/getClassifiedTables',
			{
				...data
			}
		)
	);
};
