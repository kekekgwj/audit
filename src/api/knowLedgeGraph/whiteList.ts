import { appendQueryParams, get, post } from '@/utils/request';
const env = import.meta.env;
const { VITE_API_PREFIX: API_PREFIX } = env;

interface SearchData {
	current: number;
	size: number;
	name: string;
	startTime: string;
	endTime: string;
	type: string;
}
// 白名单列表
export function getWhiteList(data: SearchData) {
	return get(
		appendQueryParams(
			API_PREFIX + '/blade-tool/graphAnalysis/getWhiteLists',
			data
		)
	);
}

//查询白名单类型列表
export function getWhiteListType() {
	return get(API_PREFIX + '/blade-tool/graphAnalysis/getWhiteListTypes');
}

interface PropertiesData {
	type: string;
}
// 根据类型获取表单配置项
export function getPrimaryProperties(data: PropertiesData) {
	return get(
		appendQueryParams(
			API_PREFIX + '/blade-tool/graphAnalysis/getPrimaryProperties',
			data
		)
	);
}

//新增白名单
interface AddData {
	type: string;
	propertyJson: object;
}
export function saveWhiteList(data: AddData) {
	return post(API_PREFIX + '/blade-tool/graphAnalysis/saveWhiteList', {
		...data
	});
}

interface DeatilData {
	whiteListId: string;
}
//根据id获取白名单详情
export function getWhiteDetail(data: DeatilData) {
	return get(
		appendQueryParams(
			API_PREFIX + '/blade-tool/graphAnalysis/getWhiteList',
			data
		)
	);
}

interface UpdateData {
	type: string;
	id: string;
	propertyJson: object;
}
//编辑白名单
export function updateWhiteList(data: UpdateData) {
	return post(API_PREFIX + '/blade-tool/graphAnalysis/updateWhiteList', {
		...data
	});
}

//删除白名单
interface DeleteData {
	id: string;
}
export function deleteWhiteList(data: any) {
	return post(API_PREFIX + '/blade-tool/graphAnalysis/deleteWhiteList', {
		...data
	});
}
