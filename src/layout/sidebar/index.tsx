import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes, CustomRoute } from '@/routers/routes';
import SvgIcon from '@/components/svg-icon';
import styles from './index.module.less';

interface MenuItem {
	path?: string;
	title: string | undefined;
	icon: string | undefined;
	active: string;
	children?: MenuItem[] | undefined;
}

const initMenu = (routes: CustomRoute[], parentPath = '') => {
	const arr: MenuItem[] = [];

	routes.forEach((route: CustomRoute) => {
		if (route?.meta?.hidden) return;
		const active = parentPath + route?.path;
		arr.push({
			path: route?.path,
			title: route?.meta?.title,
			icon: route?.meta?.icon,
			active: active,
			children: route?.children && initMenu(route.children, active)
		});
	});

	return arr;
};

export default () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [menu] = useState<MenuItem[]>(initMenu(routes));

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
				{menu[0].children?.map((m) => (
					<div
						key={m.path}
						onClick={() => {
							handleNavigate(m.path);
						}}
						className={`${styles['menu-item']} ${
							location.pathname === m.active ? styles['active'] : ''
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
				))}
				{/* <div className="menu-item"></div> */}
			</div>
		</div>
	);
};
