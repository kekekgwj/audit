import { LazyExoticComponent, lazy } from 'react';

type Meta = {
	title?: string;
	icon?: string;
	hidden?: boolean; // 是否不在菜单中显示
	active?: string; // 在菜单中显示时，路由聚焦状态判定值， 例子： active: '/test', 当前路由为/test时，该菜单处于选中状态
	rules?: Array<string>; // 权限
};

export type CustomRoute = {
	path: string;
	component: LazyExoticComponent<() => JSX.Element> | JSX.Element;
	redirect?: string;
	meta?: Meta;
	children?: CustomRoute[];
};

export const routes: CustomRoute[] = [
	{
		path: '/',
		component: lazy(() => import('@graph/layout')),
		meta: { title: '图谱分析工具', icon: 'atlas' },
		children: [
			{
				path: 'relationShip',
				component: lazy(() => import('@graph/pages/relationShip')),
				meta: { title: '图谱查询', icon: 'body' }
			},
			{
				path: 'algorithmMining',
				component: lazy(() => import('@graph/pages/algorithmMining')),
				meta: { title: '算法挖掘', icon: 'algorithm' }
			},

			{
				path: 'suspiciousRule',
				component: lazy(() => import('@graph/pages/suspiciousRule')),
				meta: { title: '可疑规则', icon: 'rule' }
			},
			{
				path: 'ruleResult',
				component: lazy(
					() => import('@graph/pages/suspiciousRule/ruleResult/index')
				),
				meta: { title: 'ruleResult', hidden: true, active: '/suspiciousRule' }
			},
			{
				path: 'altasDetail',
				component: lazy(() => import('@graph/pages/myAtlas/detail')),
				meta: { title: 'altasDetail', hidden: true, active: '/myAtlas' }
			},
			{
				path: 'whiteList',
				component: lazy(() => import('@graph/pages/whiteList')),
				meta: { title: '白名单', icon: 'white', rules: ['admin'] }
			},
			{
				path: 'myAtlas',
				component: lazy(() => import('@graph/pages/myAtlas')),
				meta: { title: '我的图谱', icon: 'my-atlas' }
			}
		]
	},
	{
		path: '/sql',
		component: lazy(() => import('@sql/layout')),
		meta: {
			title: '数据分析工具',
			icon: 'atlas'
		},
		redirect: '/sql/dataVisualization/myTemplate',

		children: [
			{
				// path: 'analysis',
				path: 'dataVisualization',
				component: lazy(() => import('@sql/pages/dataVisualization')),
				meta: { title: '数据可视化', icon: 'body' },

				children: [
					{
						path: 'myTemplate',
						component: lazy(() => import('@sql/pages/myTemplate')),
						meta: { title: '我的模板' }
					},
					{
						path: 'auditTemplate',
						component: lazy(() => import('@sql/pages/auditTemplate')),
						meta: { title: '审计模板' }
					},
					{
						path: 'templateDetail',
						component: lazy(() => import('@sql/pages/analysisTool')),
						meta: {
							title: 'templateDetail',
							hidden: true,
							active: '/myTemplate'
						}
					}
				]
			},
			{
				path: 'sqlQuery',
				component: lazy(() => import('@sql/pages/dataVisualization')),
				// component: lazy(() => import('@sql/pages/SQLEditor')),
				meta: { title: 'SQL查询', icon: 'body' },
				children: [
					{
						path: 'editer',
						component: lazy(() => import('@sql/pages/SQLEditor')),
						meta: {
							title: 'SQL执行'
						}
					},
					{
						path: 'auditRules',
						component: lazy(() => import('@sql/pages/SQLAuditRules')),
						meta: {
							title: '审计规则SQL'
						}
					},
					{
						path: 'common',
						component: lazy(() => import('@sql/pages/SQLCommon')),
						meta: {
							title: '我的常用SQL'
						}
					}
				]
			},
			{
				path: 'data',
				component: lazy(() => import('@sql/pages/dataManage')),
				meta: { title: '我的数据管理', icon: 'body' }
			},
			{
				path: 'dataDetail',
				component: lazy(() => import('@sql/pages/dataManage/detail')),
				meta: { title: 'dataDetail', hidden: true }
			}
		]
	}
];
