import { useNavigate } from 'react-router-dom';
import SvgIcon from '@/components/svg-icon';
import styles from './index.module.less';
import { useState } from 'react';

interface MenuItem {
	path?: string;
	title: string | undefined;
	icon: string | undefined;
	active: string;
	hidden: boolean | undefined;
	children?: MenuItem[] | undefined;
}

type Props = {
	menu: MenuItem;
	activeMenu: MenuItem | undefined;
	parentMenu: MenuItem | null | undefined;
};

const SidebarItem = (props: Props) => {
	const { menu, activeMenu, parentMenu } = props;
	const [toggle, setToggle] = useState(false);
	const navigate = useNavigate();

	const handleNavigate = (path: string | undefined) => {
		if (path) {
			navigate(path);
		}
	};

	const handleToggle = () => {
		setToggle(!toggle);
	};

	const computedMenu = () => {
		if (menu.hidden) return;

		if (menu.children && menu.children?.length) {
			return (
				<>
					<div
						onClick={handleToggle}
						className={`${styles['menu-item']} ${styles['menu-item--parent']} ${
							parentMenu?.active === menu.active ? styles['active'] : ''
						}`}
					>
						<div className={styles['menu-item__left']}>
							<div className={styles['menu-item__icon-box']}>
								{menu.icon && (
									<SvgIcon
										name={menu.icon}
										className={styles['menu-item__icon']}
									></SvgIcon>
								)}
							</div>
							<div>{menu.title || menu.path}</div>
						</div>

						<SvgIcon
							name="arrow-down2"
							className={`${styles['menu-item__arrow']} ${
								toggle ? styles['toggle'] : ''
							}`}
						></SvgIcon>
					</div>
					<div
						style={{ height: toggle ? menu.children.length * 50 + 'px' : '0' }}
						className={styles['sub-menu']}
					>
						{menu.children.map((m) => (
							<SidebarItem
								key={m.path}
								menu={m}
								parentMenu={parentMenu}
								activeMenu={activeMenu}
							></SidebarItem>
						))}
					</div>
				</>
			);
		} else {
			return (
				<div
					onClick={() => {
						handleNavigate(menu.path);
					}}
					className={`${styles['menu-item']} ${
						activeMenu?.active === menu.active ? styles['active'] : ''
					}`}
				>
					<div className={styles['menu-item__icon-box']}>
						{menu.icon && (
							<SvgIcon
								name={menu.icon}
								className={styles['menu-item__icon']}
							></SvgIcon>
						)}
					</div>

					<div>{menu.title || menu.path}</div>
				</div>
			);
		}
	};

	return <>{computedMenu()}</>;
};

export default SidebarItem;
