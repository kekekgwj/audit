import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes, CustomRoute } from '@/routers/routes';
import SvgIcon from '@/components/svg-icon';
import styles from './index.module.less';
import { useBaseState } from '@/redux/store';

interface MenuItem {
	path?: string;
	title: string | undefined;
	icon: string | undefined;
	active: string;
	hidden: boolean | undefined;
	children?: MenuItem[] | undefined;
}

const initMenu = (routes: CustomRoute[], parentPath = '', isAdmin = false) => {
	const arr: MenuItem[] = [];

	routes.forEach((route: CustomRoute) => {
		// if (route?.meta?.hidden) return;
		const active = route?.meta?.active
			? route?.meta?.active
			: (parentPath + '/' + route?.path).replace(/(\/)+/gi, '/');
		arr.push({
			path: route?.path,
			title: route?.meta?.title,
			icon: route?.meta?.icon,
			active: active,
			hidden:
				route?.meta?.hidden ||
				(!isAdmin && route?.meta?.rules?.includes('admin')),
			children: route?.children && initMenu(route.children, active, isAdmin)
		});
	});

	return arr;
};

const findMenu = (menus: MenuItem[], path: string): false | MenuItem => {
	for (let i = 0; i < menus.length; i++) {
		const item = menus[i];
		if (path === item.path || path === '/' + item.path) {
			return item;
		}
		if (item.children && item.children.length) {
			const flag = findMenu(item.children, path);
			if (flag) {
				return flag;
			}
		}
	}
	return false;
};

export default () => {
	const state = useBaseState();
	const navigate = useNavigate();
	const location = useLocation();
	const [activeMenu, setActiveMenu] = useState<MenuItem>();
	const [menu] = useState<MenuItem[]>(
		initMenu(routes, undefined, state.isAdmin)
	);

	useEffect(() => {
		const menuItem = findMenu(menu, location.pathname);
		if (menuItem) {
			setActiveMenu(menuItem);
		}
	}, [location]);

	const handleNavigate = (path: string | undefined) => {
		if (path) {
			navigate(path);
		}
	};
	return (
		<div>
			<div className={`${styles['parent-menu']} ${styles['menu-item']}`}>
				{menu[0]?.icon && (
					<SvgIcon
						name={menu[0]?.icon}
						className={styles['menu-item__icon']}
					></SvgIcon>
				)}
				<div>{menu[0]?.title}</div>
			</div>
			<div className="menu-list">
				{menu[0].children?.map((m) => {
					if (m.hidden) return;
					return (
						<div
							key={m.path}
							onClick={() => {
								handleNavigate(m.path);
							}}
							className={`${styles['menu-item']} ${
								activeMenu?.active === m.active ? styles['active'] : ''
							}`}
						>
							{m.icon && (
								<SvgIcon
									name={m.icon}
									className={styles['menu-item__icon']}
								></SvgIcon>
							)}
							<div>{m.title || m.path}</div>
						</div>
					);
				})}
				{/* <div className="menu-item"></div> */}
			</div>
		</div>
	);
};
