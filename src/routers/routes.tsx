import { lazy } from 'react';

type Meta = {
	title?: string;
	icon?: string;
	hidden?: boolean; // 是否不在菜单中显示
	active?: string; // 在菜单中显示时，路由聚焦状态判定值， 例子： active: '/test', 当前路由为/test时，该菜单处于选中状态
};

export type CustomRoute = {
	path: string;
	component: any;
	redirect?: string;
	meta?: Meta;
	children?: CustomRoute[];
};

export const routes: CustomRoute[] = [
	{
		path: '/',
		component: lazy(() => import('@/layout')),
		meta: { title: '供应商关系图谱', icon: 'atlas' },
		children: [
			{
				path: 'relationShip',
				component: lazy(() => import('@/pages/relationShip')),
				meta: { title: '主体查询', icon: 'body' }
			},
			{
				path: 'algorithmMining',
				component: lazy(() => import('@/pages/algorithmMining')),
				meta: { title: '算法挖掘', icon: 'algorithm' }
			},
			{
				path: 'myAtlas',
				component: lazy(() => import('@/pages/myAtlas')),
				meta: { title: '我的图谱', icon: 'my-atlas' }
			},
			{
				path: 'suspiciousRule',
				component: lazy(() => import('@/pages/suspiciousRule')),
				meta: { title: '可疑规则', icon: 'rule' }
			},
			{
				path: 'altasDetail',
				component: lazy(() => import('@/pages/myAtlas/detail')),
				meta: { title: 'altasDetail', hidden: true }
			},
			{
				path: 'whiteList',
				component: lazy(() => import('@/pages/whiteList')),
				meta: { title: '白名单', icon: 'white' }
			}
		]
	}
];
