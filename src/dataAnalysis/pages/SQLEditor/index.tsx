import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react';
import {
	Button,
	Divider,
	Table,
	message,
	ConfigProvider,
	notification
} from 'antd';
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
import { DownloadOutlined, CloseOutlined } from '@ant-design/icons';
import emptyPage from '@/assets/img/empty-data.png';

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
		const sqlStr = val.replace(/\n/g, ' '); //空格代替换行
		setSql(sqlStr);
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

	const currentRef = useRef();
	useEffect(() => {
		currentRef.current = current;
	}, [current]);

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

	const handleExecute = async (type: string) => {
		// type: 1执行需要重置页码 2:翻页不需要
		if (type == '1') {
			setCurrent(1);
		}
		const params = {
			current: type == '1' ? 1 : currentRef.current,
			size: 10,
			sql
		};
		const res = await getResultBySql(params);
		setTotal(res.total);
		const columns =
			res.head?.map((item: string, index: number) => ({
				title: item,
				dataIndex: index,
				width: 120
			})) || [];

		// 设置结果的列配置
		setColumns(columns);
		// 设置结果数据
		setResult(res.data);

		// 展示结果
		setHasResult(true);
	};

	const searchChange = (page) => {
		setCurrent(page);
		setTimeout(() => {
			if (sql) {
				handleExecute('2');
			}
		}, 200);
	};

	const handleCloseResult = () => {
		setHasResult(false);
	};

	const customizeRenderEmpty = () => (
		<div className={classes.emptyTableBox}>
			<img src={emptyPage} alt="" />
			<div className={classes.emptyTableText}>暂无数据</div>
		</div>
	);

	// useEffect(() => {
	// 	if (sql) {
	// 		handleExecute();
	// 	}
	// }, [current]);
	const Frame = () => (
		<svg
			width="22"
			height="22"
			viewBox="0 0 22 22"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g id="Frame">
				<path
					id="Vector"
					d="M11.0762 21.0526C10.6609 21.0526 10.3242 20.7159 10.3242 20.3006V16.818C10.3242 16.4027 10.6609 16.066 11.0762 16.066C11.4915 16.066 11.8281 16.4027 11.8281 16.818V20.3006C11.8281 20.7159 11.4915 21.0526 11.0762 21.0526ZM11.0762 6.31642C10.6609 6.31642 10.3242 5.97976 10.3242 5.56447V2.08185C10.3242 1.66656 10.6609 1.3299 11.0762 1.3299C11.4915 1.3299 11.8281 1.66656 11.8281 2.08185V5.56447C11.8281 5.97976 11.4915 6.31642 11.0762 6.31642ZM17.5174 18.3844C17.3249 18.3844 17.1326 18.3109 16.9857 18.1642L14.5231 15.7017C14.2294 15.408 14.2294 14.9319 14.5231 14.6382C14.8168 14.3445 15.2929 14.3445 15.5866 14.6382L18.0491 17.1007C18.3428 17.3944 18.3428 17.8705 18.0491 18.1642C17.9794 18.2341 17.8965 18.2895 17.8052 18.3273C17.714 18.3651 17.6162 18.3845 17.5174 18.3844ZM7.09748 7.96448C6.90498 7.96448 6.7127 7.89101 6.56574 7.74427L4.1032 5.28173C3.80951 4.98804 3.80951 4.51195 4.1032 4.21825C4.39689 3.92456 4.87299 3.92456 5.16668 4.21825L7.62922 6.68079C7.92291 6.97448 7.92291 7.45058 7.62922 7.74427C7.55945 7.81417 7.47656 7.86961 7.38531 7.9074C7.29406 7.94519 7.19625 7.96459 7.09748 7.96448ZM20.1855 11.9432H16.7029C16.2876 11.9432 15.951 11.6065 15.951 11.1912C15.951 10.7759 16.2876 10.4393 16.7029 10.4393H20.1855C20.6008 10.4393 20.9375 10.7759 20.9375 11.1912C20.9375 11.6065 20.6008 11.9432 20.1855 11.9432ZM5.44941 11.9432H1.9668C1.5515 11.9432 1.21484 11.6065 1.21484 11.1912C1.21484 10.7759 1.5515 10.4393 1.9668 10.4393H5.44941C5.86471 10.4393 6.20137 10.7759 6.20137 11.1912C6.20137 11.6065 5.86471 11.9432 5.44941 11.9432ZM15.0549 7.96448C14.8624 7.96448 14.6701 7.89101 14.5231 7.74427C14.2294 7.45058 14.2294 6.97448 14.5231 6.68079L16.9857 4.21825C17.2794 3.92456 17.7554 3.92456 18.0491 4.21825C18.3428 4.51195 18.3428 4.98804 18.0491 5.28173L15.5866 7.74427C15.4399 7.89101 15.2474 7.96448 15.0549 7.96448ZM4.63494 18.3844C4.44244 18.3844 4.25016 18.3109 4.1032 18.1642C3.80951 17.8705 3.80951 17.3944 4.1032 17.1007L6.56574 14.6382C6.85943 14.3445 7.33553 14.3445 7.62922 14.6382C7.92291 14.9319 7.92291 15.408 7.62922 15.7017L5.16668 18.1642C5.09691 18.2341 5.01402 18.2895 4.92277 18.3273C4.83152 18.3651 4.73371 18.3845 4.63494 18.3844Z"
					fill="url(#paint0_angular_1005_29567)"
				/>
			</g>
			<defs>
				<radialGradient
					id="paint0_angular_1005_29567"
					cx="0"
					cy="0"
					r="1"
					gradientUnits="userSpaceOnUse"
					gradientTransform="translate(11.0762 11.1912) rotate(70.7581) scale(10.3892)"
				>
					<stop stop-color="#23955C" />
					<stop offset="1" stop-color="#C1EFD8" />
				</radialGradient>
			</defs>
		</svg>
	);

	const clouseNotification = (uniqueKey: string) => {
		notification.destroy(uniqueKey);
	};

	const showNotification = (uniqueKey: string, fileName: string) => {
		notification.open({
			key: uniqueKey,
			className: 'notificationWrap',
			message: '',
			description: (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						fontSize: '14px',
						color: '#18181F',
						lineHeight: '22px'
					}}
				>
					{fileName}
					<span style={{ marginLeft: '20px', display: 'inline-block' }}>
						下载中...
					</span>
					<span className={classes.loadingIcon}>
						<Frame />
					</span>
				</div>
			),
			placement: 'bottomLeft',
			icon: <div className={classes.tableIcon} />,
			duration: null
		});
	};

	// 下载
	const handleDownLoad = async () => {
		const uniqueKey = Date.now().toString();
		showNotification(uniqueKey, '导出结果.xlsx');
		await exportBySql(sql, 'sql执行.xlsx');

		clouseNotification(uniqueKey);
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
						onClick={() => {
							handleExecute('1');
						}}
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
						// minLines={15}
						// maxLines={10}
						width="100%"
						height="100%"
						showPrintMargin={false}
						showGutter={false}
						placeholder="Write your Query here..."
						// editorProps={{ $blockScrolling: true }}
						setOptions={{
							enableBasicAutocompletion: true,
							enableSnippets: true,
							enableLiveAutocompletion: false
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
						<div className={classes.sqlResultBox}>
							<div className={classes.aceResultMid}>
								<div className={classes.downloadBtn} onClick={handleDownLoad}>
									<SvgIcon
										name="download"
										className={classes.downloadIcon}
									></SvgIcon>
									<span>下载</span>
								</div>
								<div onClick={handleCloseResult}>
									<CloseOutlined style={{ fontSize: '14px' }} />
								</div>
							</div>
							<div className={classes.aceResultTable}>
								<ConfigProvider renderEmpty={customizeRenderEmpty}>
									<Table
										columns={columns}
										dataSource={result}
										// scroll={{ y: 300 }}
										scroll={{ y: 120 }}
										pagination={{
											current,
											total,
											pageSize: 10,
											onChange: (page) => {
												searchChange(page);
											}
										}}
									/>
								</ConfigProvider>
							</div>
						</div>
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
