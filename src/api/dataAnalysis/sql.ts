import { appendQueryParams, get, post, download } from '@/utils/request';
const env = import.meta.env;
const { VITE_API_PREFIX: API_PREFIX } = env;

interface IGetProject {
	size: number;
	current: number;
	name: string;
}

interface AuditSql {
	id: string;
	name: string;
	effect: string;
	sql?: string;
}

interface MySql {
	id: string;
	name: string;
	gmtCreated?: string;
	gmtModified?: string;
	sql?: string;
}

type SqlCommonRes = {
	countId: number;
	current: number;
	maxLimit: number;
	optimizeCountSql: boolean;
	orders: Array<any>;
	pages: number;
	searchCount: boolean;
	size: boolean;
	total: number;
};

type AuditSqlRes = SqlCommonRes & {
	records: Array<AuditSql>;
};

type MySqlRes = SqlCommonRes & {
	records: Array<MySql>;
};

interface IMySqlQuery {
	current: number;
	size: number;
	name: string;
	startTime: string;
	endTime: string;
}

interface AddForm {
	sqlId?: string | number;
	sql: string;
	sqlName: string;
}

// 查询审计规则sql分页列表
export function getAuditSqlPage(data: IGetProject) {
	return get<AuditSqlRes>(
		appendQueryParams(API_PREFIX + '/blade-tool/dataAnalysis/getAuditSqlPage', {
			...data
		})
	);
}

// 查看审计规则sql
export function getAuditSql(id: number | string) {
	return get<AuditSql>(
		appendQueryParams(API_PREFIX + '/blade-tool/dataAnalysis/getAuditSql', {
			sqlId: id
		})
	);
}

// 查询我的常用sql分页列表
export function getSqlPage(data: IMySqlQuery) {
	return get<MySqlRes>(
		appendQueryParams(API_PREFIX + '/blade-tool/dataAnalysis/getSqlPage', {
			...data
		})
	);
}

// 查看我的常用sql
export function getSql(id: string | number) {
	return get<MySql>(
		appendQueryParams(API_PREFIX + '/blade-tool/dataAnalysis/getSql', {
			sqlId: id
		})
	);
}

// 新增我的常用sql
export function saveSql(data: AddForm) {
	return post<MySql>(API_PREFIX + '/blade-tool/dataAnalysis/saveSql', data);
}

// 编辑我的常用sql
export function updateSql(data: AddForm) {
	return post(API_PREFIX + '/blade-tool/dataAnalysis/updateSql', data);
}

// 删除我的常用sql
export function deleteSql(id: string | number) {
	return post<MySql>(API_PREFIX + '/blade-tool/dataAnalysis/deleteSql', {
		sqlId: id
	});
}

// 执行传入的sql语句，返回查询结果
export function getResultBySql(sql: string) {
	return post(API_PREFIX + '/blade-tool/dataAnalysis/getResultBySql', {
		sql
	});
}

// 查询我的常用sql列表
export function getSqls() {
	return get<MySql[]>(
		appendQueryParams(API_PREFIX + '/blade-tool/dataAnalysis/getSqls')
	);
}

// 查询我的常用sql列表
export function getAuditSqls() {
	return get<MySql[]>(
		appendQueryParams(API_PREFIX + '/blade-tool/dataAnalysis/getAuditSqls')
	);
}

interface Tables {
	id: string | number;
	tableCnName: string;
	tableName: string;
}

// 查询数据列表
export function getTables(data: { queryType: number; orderBy: number }) {
	return get<Tables[]>(
		appendQueryParams(API_PREFIX + '/blade-tool/dataAnalysis/getTables', {
			...data
		})
	);
}

// 执行传入的sql语句，导出查询结果
export function exportBySql(sql: string, fileName: string) {
	return download(
		new Request(API_PREFIX + '/blade-tool/dataAnalysis/exportBySql', {
			method: 'post',
			body: JSON.stringify({ sql }),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		}),
		fileName
	);
}
