import { appendQueryParams, get, post, postFormData } from '@/utils/request';
const env = import.meta.env;
const { VITE_API_PREFIX: API_PREFIX } = env;

// 我的模板列表
interface IGetProject {
	size: number;
	current: number;
}
export function getAuditProjects(data: IGetProject) {
	return get(
		appendQueryParams(
			API_PREFIX + '/blade-tool/dataAnalysis/getAuditProjects',
			data
		)
	);
}

//复制
interface ICopyProject {
	auditProjectId: number;
	name: string;
}
export function copyAuditProject(data: ICopyProject) {
	return post(API_PREFIX + '/blade-tool/dataAnalysis/copyAuditProject', {
		...data
	});
}
