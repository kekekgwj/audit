import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes, CustomRoute } from '@/routers/routes';
import SvgIcon from '@/components/svg-icon';
import SidebarItem from './sidebar-item';
import styles from './index.module.less';

interface MenuItem {
	path?: string;
	title: string | undefined;
	icon: string | undefined;
	active: string;
	hidden: boolean | undefined;
	children?: MenuItem[] | undefined;
}

const initMenu = (routes: CustomRoute[], parentPath = '') => {
	const arr: MenuItem[] = [];

	routes.forEach((route: CustomRoute) => {
		if (route?.meta?.hidden) return;
		const path = (parentPath + '/' + route?.path).replace(/(\/)+/gi, '/');
		const active = route?.meta?.active ? route?.meta?.active : path;
		arr.push({
			path: path,
			title: route?.meta?.title,
			icon: route?.meta?.icon,
			active: active,
			hidden: route?.meta?.hidden,
			children: route?.children && initMenu(route.children, active)
		});
	});

	return arr;
};

const findMenu = (
	menus: MenuItem[],
	path: string,
	parent: MenuItem | null
): false | { parent: MenuItem | null; active: MenuItem } => {
	for (let i = 0; i < menus.length; i++) {
		const item = menus[i];
		if (path === item.path || path === '/sql/' + item.path) {
			return {
				parent: parent,
				active: item
			};
		}
		if (item.children && item.children.length) {
			const flag = findMenu(item.children, path, item);
			if (flag) {
				return {
					parent: flag.parent,
					active: flag.active
				};
			}
		}
	}
	return false;
};

export default () => {
	// const navigate = useNavigate();
	const location = useLocation();
	const [activeMenu, setActiveMenu] = useState<MenuItem>();
	const [parentMenu, setParentMenu] = useState<MenuItem | undefined | null>();
	const [menus] = useState<MenuItem[]>(initMenu(routes));
	// const [defaultOpen, setDefaultOpen] = useState(false);

	useEffect(() => {
		const res = findMenu(menus, location.pathname, null);
		if (res) {
			const { parent, active } = res;
			setActiveMenu(active);
			setParentMenu(parent);
		}
	}, [location]);

	// const handleNavigate = (path: string | undefined) => {
	// 	if (path) {
	// 		navigate(path);
	// 	}
	// };
	const menu = menus[1];

	return (
		<div>
			<div className={`${styles['parent-menu']} ${styles['menu-item']}`}>
				{menu?.icon && (
					<SvgIcon
						name={menu?.icon}
						className={styles['menu-item__icon--parent']}
					></SvgIcon>
				)}
				<div>{menu?.title}</div>
			</div>
			<div className="menu-list">
				{menu.children?.map((m) => (
					<SidebarItem
						key={m.path}
						menu={m}
						parentMenu={parentMenu}
						activeMenu={activeMenu}
					></SidebarItem>
				))}
				{/* <div className="menu-item"></div> */}
			</div>
		</div>
	);
};
