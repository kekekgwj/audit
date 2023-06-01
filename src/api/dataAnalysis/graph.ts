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
