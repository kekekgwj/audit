import './index.less';

interface Props {
	name: string; // 字体图标名称
	color?: string; // 字体图标颜色
}

export default (props: Props) => {
	const { name, color } = props;

	const iconName = `#icon-${name}`;
	return (
		<svg aria-hidden="true" className="icon-svg">
			<use xlinkHref={iconName} fill={color} />
		</svg>
	);
};
