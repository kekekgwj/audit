/**
 * 属性面板
 */
interface IPropertiesProps {
	title: string;
	data: IPropertiesData[];
	children: React.ReactElement;
}

interface IPropertiesData {
	[key: string]: string;
}
