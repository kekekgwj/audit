import { appendQueryParams, get, post, postFormData } from '@/utils/request';
const env = import.meta.env;
const { VITE_API_PREFIX: API_PREFIX } = env;
//数据表
interface SearchData {
	tableName: string;
	createdBeginTime: string;
	createdEndTime: string;
	modifiedBeginTime: string;
	modifiedEndTime: string;
	current: number;
	size: number;
}
export function getDataList(data: SearchData) {
	const formData = new FormData();
	for (const key in data) {
		if (Object.prototype.hasOwnProperty.call(data, key)) {
			formData.append(key, data[key]);
		}
	}
	return postFormData(
		API_PREFIX + '/blade-tool/dataAnalysis/listMyTables',
		formData
	);
}

// 删除数据
interface DeleteData {
	tableId: string;
}
export function deleteData(data: DeleteData) {
	return post(API_PREFIX + '/blade-tool/dataAnalysis/deleteMyTable', {
		...data
	});
}

// 导入数据
export function importTable(formData: FormData) {
	return postFormData(
		API_PREFIX + '/blade-tool/dataAnalysis/importTable',
		formData
	);
}

//查看数据详情
interface DetailData {
	id: string;
}
export function getMyTable(data: DetailData) {
	return get(
		appendQueryParams(API_PREFIX + '/blade-tool/dataAnalysis/getMyTable', data)
	);
}
