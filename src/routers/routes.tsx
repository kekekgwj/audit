import { LazyExoticComponent, lazy } from 'react';

type Meta = {
	title?: string;
	icon?: string;
	hidden?: boolean; // 是否不在菜单中显示
	active?: string; // 在菜单中显示时，路由聚焦状态判定值， 例子： active: '/test', 当前路由为/test时，该菜单处于选中状态
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
				meta: { title: '主体查询', icon: 'body' }
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
				meta: { title: '白名单', icon: 'white' }
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
		meta: { title: '数据分析工具', icon: 'atlas' },
		children: [
			{
				path: 'analysis',
				component: lazy(() => import('@sql/pages/analysisTool')),
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
					}
				]
			},
			{
				path: 'editor',
				component: lazy(() => import('@sql/pages/SQLEditor')),
				meta: { title: 'SQL查询', icon: 'body' }
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
			// {
			// 	path: 'myTemplate',
			// 	component: lazy(() => import('@sql/pages/myTemplate')),
			// 	meta: { title: '我的模板', icon: 'body' }
			// },
			// {
			// 	path: 'auditTemplate',
			// 	component: lazy(() => import('@sql/pages/auditTemplate')),
			// 	meta: { title: '审计模板', icon: 'body' }
			// }
		]
	}
];
