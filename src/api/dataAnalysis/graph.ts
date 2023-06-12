import { appendQueryParams, get, post, postFormData } from '@/utils/request';
import { Interface } from 'readline';
import { string } from 'prop-types';
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

//获取我的模板画布内容
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
//获取审计模板画布内容
interface IGetAuditProjectCanvas {
	auditProjectId: number;
}
interface IGetAuditProjectCanvasResponse {
	canvasJson: string;
	id: number;
	name: string;
}
export function getAuditProjectCanvas(
	data: IGetAuditProjectCanvas
): Promise<IGetAuditProjectCanvasResponse> {
	return get(
		appendQueryParams(
			API_PREFIX + '/blade-tool/dataAnalysis/getAuditProjectCanvas',
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

//保存为审计模板
interface ISaveAsAuditProject {
	projectId: number;
	name: string;
}
export function saveAsAuditProject(data: ISaveAsAuditProject) {
	return post(API_PREFIX + '/blade-tool/dataAnalysis/saveAsAuditProject', {
		...data
	});
}

//画布元素执行，获取结果

interface IGetResult {
	projectId: number | string;
	executeId: number | string;
	canvasJson: string;
}
interface IExeResponse {
	data: any[];
	head: string[];
}
export function getResult(data: IGetResult) {
	return post<IExeResponse>(API_PREFIX + '/blade-tool/dataAnalysis/getResult', {
		...data
	});
}

//下载导出
interface IExportData {
	projectId: number;
	canvasJson?: string;
}
interface IExportDataResponse {}
export function exportData(data: IExportData): Promise<IExportDataResponse> {
	return get(
		appendQueryParams(API_PREFIX + '/blade-tool/dataAnalysis/export', data)
	);
}

//获取工具组件配置项
interface IGetCanvasConfig {
	id: string;
	canvasJson: string;
}
export function getCanvasConfig(data: IGetCanvasConfig) {
	return post(API_PREFIX + '/blade-tool/dataAnalysis/getCanvasConfig', {
		...data
	});
}
