import { appendQueryParams, get, post, postFormData } from '@/utils/request';
const env = import.meta.env;
const { VITE_API_PREFIX: API_PREFIX } = env;
//保存画布模板
interface ISaveProjectCanvas {
	projectId: number;
	canvasJson: string;
	configs?: any;
}
export function saveProjectCanvas(data: ISaveProjectCanvas) {
	return post(API_PREFIX + '/blade-tool/dataAnalysis/saveProjectCanvas', {
		...data
	});
}

//获取画布模板
interface IGetProjectCanvas {
	projectId: number;
}
interface IGetProjectCanvasResponse {
	canvasJson: string;
	id: number;
	name: string;
}
export function getProjectCanvas(
	data: IGetProjectCanvas
): Promise<IGetProjectCanvasResponse> {
	return get(
		appendQueryParams(
			API_PREFIX + '/blade-tool/dataAnalysis/getProjectCanvas',
			data
		)
	);
}

// 获取数据列表
interface IGetTablesData {
	orderBy?: number;
	queryType?: number; //1系统数据 2我的数据 3系统数据和我的数据
	tableCnName?: string;
	tableName?: string;
}
interface IGetTablesDataResponse {
	id: number;
	tableCnName: string;
	tableName: string;
}
export function getTablesData(
	data: IGetTablesData
): Promise<IGetTablesDataResponse> {
	return get(
		appendQueryParams(API_PREFIX + '/blade-tool/dataAnalysis/getTables', data)
	);
}
