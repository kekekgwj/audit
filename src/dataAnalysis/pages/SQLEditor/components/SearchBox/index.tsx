import React, {
	FC,
	ReactElement,
	RefObject,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react';
import classes from './index.module.less';
import { EditorContext, BoxType } from '../..';
import { highlight } from 'sql-highlight';
import { Markup } from 'interweave';
interface IProps {
	pos: {
		left: number;
		top: number;
	};
	type: Omit<BoxType, BoxType.NONE>;
}
interface ISQlBOX {}
interface ISQLBoxBlock {
	handleClickItem: (index: number) => void;
	index: number;
	title: string;
	content: string | ReactElement;
}
function useHover<T extends HTMLElement = HTMLElement>(
	elementRef: RefObject<T>
) {
	const [isHovered, setIsHovered] = useState<boolean>(false);
	function handleMouseOver() {
		setIsHovered(true);
	}
	function handleMouseOut() {
		setIsHovered(false);
	}
	useEffect(() => {
		const element = elementRef.current;
		if (element) {
			element.addEventListener('mouseover', handleMouseOver);
			element.addEventListener('mouseout', handleMouseOut);

			return () => {
				element.removeEventListener('mouseover', handleMouseOver);
				element.removeEventListener('mouseout', handleMouseOut);
			};
		}
	}, []);
	return isHovered;
}

const SQLBoxBlock: FC<ISQLBoxBlock> = ({
	handleClickItem,
	index,
	title,
	content
}) => {
	const ref = useRef(null);
	const isHovered = useHover(ref);
	return (
		<div
			className={`${classes.sqlBox} ${isHovered ? classes.selectedBlock : ''}`}
			key={index}
			onClick={() => handleClickItem(index)}
			ref={ref}
		>
			<div className={classes.sqlBox_title}>{title}</div>
			<Markup content={content} />
			{/* <div className={classes.content}>{content}</div> */}
		</div>
	);
};
const SQLBox: FC<ISQlBOX> = ({}) => {
	const context = useContext(EditorContext) as {
		insertText: (text: string) => void;
	};
	const insertText = context.insertText;
	const handleClickItem = (index: number) => {
		insertText && insertText(data[index]['value']);
	};
	// todo sql关键词高亮
	const data = [
		{
			title: '审计规则SQL',
			content: highlight('SELECT * FROM TEST表', { html: true }),
			value: 'SELECT * FROM TEST表'
		},
		{
			title: '我的常用SQL',
			content: highlight('SELECT * FROM 之江实验室app用户访问数据', {
				html: true
			}),
			value: 'SELECT * FROM 之江实验室app用户访问数据'
		}
	];
	return (
		<div className={classes.sqlBoxContainer}>
			<div className={classes.sqlBoxContainer_title}>{'SQL语句'}</div>
			<div>
				{data.map(({ title, content, value }, index) => (
					<SQLBoxBlock
						key={index}
						title={title}
						content={content}
						index={index}
						handleClickItem={handleClickItem}
					/>
				))}
			</div>
		</div>
	);
};

const TableBox: FC = () => {
	const data = [
		{
			content: '测试表名1'
		},
		{
			content: '测试表名22'
		},
		{
			content: '测试表名3'
		}
	];
	const context = useContext(EditorContext) as {
		insertText: (text: string) => void;
	};
	const insertText = context.insertText;
	const handleClickItem = (index: number) => {
		insertText && insertText(data[index]['content']);
	};
	return (
		<div className={classes.sqlBoxContainer}>
			<div className={classes.sqlBoxContainer_title}>{'数据表'}</div>
			<div>
				<ul style={{ listStyleType: 'none' }}>
					{data.map(({ content }, index) => (
						<li key={index} onClick={() => handleClickItem(index)}>
							{content}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
const ColumnBox: FC = () => {
	const data = [
		{
			content: '测试表名1'
		},
		{
			content: '测试表名22'
		},
		{
			content: '测试表名3'
		}
	];
	const context = useContext(EditorContext) as {
		insertText: (text: string) => void;
	};
	const insertText = context.insertText;
	const handleClickItem = (index: number) => {
		insertText && insertText(data[index]['content']);
	};
	return (
		<div className={classes.sqlBoxContainer}>
			<div className={classes.sqlBoxContainer_title}>{'字段'}</div>
			<div>
				<ul style={{ listStyleType: 'none' }}>
					{data.map(({ content }, index) => (
						<li key={index} onClick={() => handleClickItem(index)}>
							{content}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
const SearchBox: FC<IProps> = ({ pos, type }) => {
	const offsetLeft = (pos?.left || 0) - 150;
	const offsetTop = (pos?.top || 0) + 30;
	return (
		<div
			style={{
				position: 'absolute',
				left: offsetLeft,
				top: offsetTop
			}}
			className={classes.wrapper}
		>
			{type === BoxType.SQL && <SQLBox />}
			{type === BoxType.TABLE && <TableBox />}
			{type === BoxType.COLUMN && <ColumnBox />}
		</div>
	);
};

export default SearchBox;
