import './index.less';

interface Props {
	name: string; // 字体图标名称
	color?: string; // 字体图标颜色
	className?: string;
}

export default (props: Props) => {
	const { name, color, className } = props;

	const iconName = `#icon-${name}`;

	const c = `${className || ''} icon-svg`;

	return (
		<svg aria-hidden="true" className={c}>
			<use xlinkHref={iconName} fill={color} />
		</svg>
	);
};
