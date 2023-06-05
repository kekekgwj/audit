import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react';
import { Button, Divider, Table } from 'antd';
import AceEditor from 'react-ace';
import classes from './index.module.less';
// import 'ace-builds/src-noconflict/mode-javascript';
// import 'ace-builds/src-noconflict/snippets/javascript';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/snippets/sql';
import 'ace-builds/src-min-noconflict/ext-searchbox';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import SearchBox from './components/SearchBox';
import ReactAce from 'react-ace/lib/ace';
import TableSourcePanel from './components/TableSourcePanel';
import SvgIcon from '@/components/svg-icon';
import SaveDialog from './components/SaveDialog';

export const EditorContext = createContext({});

export enum BoxType {
	SQL,
	TABLE,
	COLUMN,
	NONE
}

const SQLEditor: React.FC = () => {
	useEffect(() => {
		// if (editorRef && editorRef.current) {
		// 	editorRef.current.editor.addEventListener('blur', () =>
		// 		setShowSearchBox(BoxType.NONE)
		// 	);
		// 	return () => {
		// 		editorRef?.current?.editor.removeEventListener('blur', () => {});
		// 	};
		// }
	}, []);
	const onChange = () => {
		setShowSearchBox(BoxType.NONE);
		// 获得焦点

		if (editorRef && editorRef.current) {
			const editorCur = editorRef.current;
			editorCur.editor.focus();
		}
	};
	const getCursorPosition = () => {
		if (editorRef && editorRef.current) {
			const editor = editorRef.current.editor;
			const renderer = editor.renderer;
			const rect = editor.container.getBoundingClientRect();
			const { row, column } = editor.getCursorPosition();
			const session = editor.getSession();
			const base = session.doc.createAnchor(row, column);
			const pos = renderer.$cursorLayer.getPixelPosition(base, true);

			pos.top += rect.top - renderer.layerConfig.offset;
			pos.left += rect.left - editor.renderer.scrollLeft;
			// pos.left += renderer.gutterWidth;

			setPos(pos);
			return pos;
		}
	};
	const insertText = (text: string) => {
		if (!editorRef || !editorRef.current) {
			return;
		}
		editorRef.current.editor.insert(text);
	};
	const editorRef = useRef<ReactAce>(null);
	interface IPos {
		top: number;
		left: number;
	}
	const [hasResult, setHasResult] = useState(false);
	const [columns, setColumns] = useState<any>();
	const [result, setResult] = useState<any>();
	const [openAdd, setOpenAdd] = useState(false);
	const [pos, setPos] = useState<IPos>({ top: 0, left: 0 });
	const [showSearchBox, setShowSearchBox] = useState<BoxType>(BoxType.NONE);
	const triggerSearchBox = (type: BoxType) => {
		getCursorPosition();
		setShowSearchBox(type);
	};

	// 保存为我的常用sql
	const handleSubmitAdd = (form: { sqlName: string }) => {
		console.log(form);
		setOpenAdd(false);
	};

	// 取消保存为我的常用sql
	const handleCancelAdd = () => {
		setOpenAdd(false);
	};

	// 打开保存为我的常用sql弹框
	const handleAddCommon = () => {
		setOpenAdd(true);
	};

	const handleExecute = () => {
		// TODO 请求后端接口

		// 设置结果的列配置
		setColumns([
			{
				title: 'Age',
				dataIndex: 'age',
				key: 'age'
			},
			{
				title: 'Address',
				dataIndex: 'address',
				key: 'address'
			}
		]);
		// 设置结果数据
		setResult([
			{
				key: '1',
				name: 'John Brown',
				age: 32,
				address: 'New York No. 1 Lake Park',
				tags: ['nice', 'developer']
			},
			{
				key: '2',
				name: 'Jim Green',
				age: 42,
				address: 'London No. 1 Lake Park',
				tags: ['loser']
			},
			{
				key: '3',
				name: 'Joe Black',
				age: 32,
				address: 'Sydney No. 1 Lake Park',
				tags: ['cool', 'teacher']
			}
		]);
		// 展示结果
		setHasResult(true);
	};
	return (
		<div className={classes.container}>
			<TableSourcePanel />
			<div className={classes.editorWrapper}>
				<div className={classes.editorWrapper_tips}>
					<div className={classes.hints}>
						<span className={classes.boldText}>参数配置 : </span>
						<span className={classes.hintText}>
							请输入"#"选择SQL语句，输入"$"选择数据表
						</span>
					</div>
					{/* <div className={classes.executeBtn}>执行</div> */}
					<Button
						type="primary"
						className={classes.executeBtn}
						onClick={handleExecute}
					>
						执行
					</Button>
				</div>
				<div className={classes.aceWrapper}>
					<AceEditor
						id="editor"
						aria-label="editor"
						mode="sql"
						theme="github"
						name="editor"
						ref={editorRef}
						fontSize={16}
						minLines={15}
						maxLines={10}
						width="100%"
						showPrintMargin={false}
						showGutter={false}
						placeholder="Write your Query here..."
						// editorProps={{ $blockScrolling: true }}
						setOptions={{
							enableBasicAutocompletion: true,
							enableSnippets: true,
							enableLiveAutocompletion: true
						}}
						commands={[
							{
								name: '选择SQL语句',
								bindKey: { win: '#', mac: '#' },
								exec: () => {
									triggerSearchBox(BoxType.SQL);
								}
							},
							{
								name: '选择表名',
								bindKey: { win: '$', mac: '$' },
								exec: () => {
									triggerSearchBox(BoxType.TABLE);
								}
							}
							// {
							// 	name: '选择字段',
							// 	bindKey: { win: '!', mac: '!' },
							// 	exec: () => {
							// 		triggerSearchBox(BoxType.COLUMN);
							// 	}
							// }
						]}
						// value={value}
						onChange={onChange}
						showLineNumbers
					/>
				</div>
				{/* <div className={classes.dividerWrapper}>
					<Divider className={classes.divider} />
				</div> */}

				{/* <div className={classes.saveBtn}>保存为我的常用</div> */}

				<div className={classes.aceResult}>
					<div className={classes.aceResultTop}>
						<Button
							type="primary"
							className={classes.saveBtn}
							onClick={handleAddCommon}
						>
							保存为我的常用
						</Button>
					</div>
					{hasResult && (
						<>
							<div className={classes.aceResultMid}>
								<div className={classes.downloadBtn}>
									<SvgIcon
										name="see"
										className={classes.downloadIcon}
									></SvgIcon>
									<span>下载</span>
								</div>
							</div>
							<div className={classes.aceResultTable}>
								<Table
									columns={columns}
									dataSource={result}
									scroll={{ y: 300 }}
									pagination={false}
								/>
							</div>
						</>
					)}
				</div>
			</div>

			<EditorContext.Provider value={{ insertText }}>
				{showSearchBox !== BoxType.NONE && (
					<SearchBox pos={pos} type={showSearchBox} />
				)}
			</EditorContext.Provider>

			<SaveDialog
				open={openAdd}
				defaultValue={{
					sqlName: ''
				}}
				submit={handleSubmitAdd}
				cancel={handleCancelAdd}
			></SaveDialog>
		</div>
	);
};

export default SQLEditor;
