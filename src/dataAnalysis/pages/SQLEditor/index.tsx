import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react';
import { Button, Divider, Table, message } from 'antd';
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

import { saveSql, getResultBySql, exportBySql } from '@/api/dataAnalysis/sql';
import { DownloadOutlined } from '@ant-design/icons';

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
	const onChange = (val: string) => {
		setSql(val);
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
	const [sql, setSql] = useState('');
	const [current, setCurrent] = useState(1);
	const [total, setTotal] = useState(0);

	const [messageApi, contextHolder] = message.useMessage();

	const triggerSearchBox = (type: BoxType) => {
		getCursorPosition();
		setShowSearchBox(type);
	};

	// 保存为我的常用sql
	const handleSubmitAdd = async (form: { sqlName: string }) => {
		await saveSql({
			sql: sql,
			sqlName: form.sqlName
		});

		messageApi.open({
			type: 'success',
			content: '保存成功'
		});

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

	const handleExecute = async () => {
		const params = {
			current,
			size: 10,
			sql
		};
		const res = await getResultBySql(params);
		setTotal(res.total);
		const columns = res.head.map((item: string, index: number) => ({
			title: item,
			dataIndex: index,
			width: 120
		}));

		// 设置结果的列配置

		setColumns(columns);
		// 设置结果数据
		setResult(res.data);
		// 展示结果
		setHasResult(true);
	};

	const searchChange = (page) => {
		console.log(page, 151515151);
		setCurrent(page);
	};

	useEffect(() => {
		if (sql) {
			handleExecute();
		}
	}, [current]);

	// 下载
	const handleDownLoad = async () => {
		await exportBySql(sql, 'sql执行.xlsx');
	};
	return (
		<div className={classes.container}>
			{/* <TableSourcePanel /> */}
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
								<div className={classes.downloadBtn} onClick={handleDownLoad}>
									<SvgIcon
										name="download"
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
									pagination={{
										current,
										total,
										pageSize: 10,
										onChange: (page) => {
											searchChange(page);
										}
									}}
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

			{contextHolder}
		</div>
	);
};

export default SQLEditor;
