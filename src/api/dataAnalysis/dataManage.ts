import { appendQueryParams, get, post, postFormData } from '@/utils/request';
const env = import.meta.env;
const { VITE_API_PREFIX: API_PREFIX } = env;
//数据表
export function getDataList(data: any) {
	return post(API_PREFIX + '/blade-tool/dataAnalysis/listMyTables', {
		...data
	});
}

// 删除数据
export function deleteData(data: any) {
	return post(API_PREFIX + '/blade-tool/dataAnalysis/deleteMyTable', {
		...data
	});
}

// 导入数据

export function importTable(formData: any) {
	return postFormData(
		API_PREFIX + '/blade-tool/dataAnalysis/importTable',
		formData
	);
}
