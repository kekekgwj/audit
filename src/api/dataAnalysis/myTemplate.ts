import { appendQueryParams, get, post, postFormData } from '@/utils/request';
const env = import.meta.env;
const { VITE_API_PREFIX: API_PREFIX } = env;

// 新建我的模板
interface ISaveProject {
	name: string;
}
export function saveProject(data: ISaveProject) {
	return post(API_PREFIX + '/blade-tool/dataAnalysis/saveProject', {
		...data
	});
}

// 我的模板列表
interface IGetProject {
	size: number;
	current: number;
}
export function getProjects(data: IGetProject) {
	return get(
		appendQueryParams(API_PREFIX + '/blade-tool/dataAnalysis/getProjects', data)
	);
}

//删除我的模板
interface IDeleteProject {
	projectId: number | string;
}
export function deleteProject(data: IDeleteProject) {
	return post(API_PREFIX + '/blade-tool/dataAnalysis/deleteProject', {
		...data
	});
}

//编辑
interface IUpdateProject {
	projectId: number | string;
	name: string;
}
export function updateProject(data: IUpdateProject) {
	return post(API_PREFIX + '/blade-tool/dataAnalysis/updateProject', {
		...data
	});
}
