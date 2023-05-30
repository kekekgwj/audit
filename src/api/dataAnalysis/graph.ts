import { appendQueryParams, get, post, postFormData } from '@/utils/request';
const env = import.meta.env;
const { VITE_API_PREFIX: API_PREFIX } = env;
//保存画布模板
interface ISaveProjectCanvas {
	projectId: number;
	canvasJson: string;
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
export function getProjectCanvas(data: IGetProjectCanvas) {
	return get(
		appendQueryParams(
			API_PREFIX + '/blade-tool/dataAnalysis/getProjectCanvas',
			data
		)
	);
}
