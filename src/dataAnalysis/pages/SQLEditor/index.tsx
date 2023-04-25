import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react';
import AceEditor from 'react-ace';

// import 'ace-builds/src-noconflict/mode-javascript';
// import 'ace-builds/src-noconflict/snippets/javascript';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/snippets/sql';
import 'ace-builds/src-min-noconflict/ext-searchbox';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import SearchBox from './components/SearchBox';
import ReactAce from 'react-ace/lib/ace';

export const EditorContext = createContext({});

export enum BoxType {
	SQL,
	TABLE,
	COLUMN,
	NONE
}

const SQLEditor: React.FC = () => {
	useEffect(() => {
		if (editorRef && editorRef.current) {
			editorRef.current.editor.addEventListener('blur', () =>
				setShowSearchBox(BoxType.NONE)
			);
			return () => {
				editorRef?.current?.editor.removeEventListener('blur', () => {});
			};
		}
	}, []);
	const onChange = (...args) => {
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

			const { row, column } = editor.getCursorPosition();
			const session = editor.getSession();
			const base = session.doc.createAnchor(row, column);
			const pos = renderer.$cursorLayer.getPixelPosition(base, true);

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
	const [pos, setPos] = useState<IPos>({ top: 0, left: 0 });
	const [showSearchBox, setShowSearchBox] = useState<BoxType>(BoxType.NONE);
	const triggerSearchBox = (type: BoxType) => {
		getCursorPosition();
		setShowSearchBox(type);
	};
	return (
		<div>
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
				showGutter
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
					},
					{
						name: '选择字段',
						bindKey: { win: '!', mac: '!' },
						exec: () => {
							triggerSearchBox(BoxType.COLUMN);
						}
					}
				]}
				// value={value}
				onChange={onChange}
				showLineNumbers
			/>
			<EditorContext.Provider value={{ insertText }}>
				{showSearchBox !== BoxType.NONE && (
					<SearchBox pos={pos} type={showSearchBox} />
				)}
			</EditorContext.Provider>
		</div>
	);
};

export default SQLEditor;
