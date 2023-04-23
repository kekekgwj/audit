import React, { useRef } from 'react';
import AceEditor from 'react-ace';
// https://github.com/securingsincity/react-ace/blob/master/docs/FAQ.md
const SQLEditor: React.FC = () => {
	const onChange = (...args) => {
		console.log(args);
	};
	const editorRef = useRef(null);
	return (
		<div>
			<AceEditor
				id="editor"
				aria-label="editor"
				mode="mysql"
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
				editorProps={{ $blockScrolling: true }}
				setOptions={{
					enableBasicAutocompletion: true,
					enableLiveAutocompletion: true,
					enableSnippets: true
				}}
				commands={[
					{
						name: '选择SQL语句',
						bindKey: { win: '#', mac: '#' },
						exec: () => {
							console.log('选择SQL语句');
						}
					},
					{
						name: '',
						bindKey: { win: '$', mac: '$' },
						exec: () => {
							console.log('选择数据表');
						}
					},
					{
						name: '',
						bindKey: { win: '!', mac: '!' },
						exec: () => {
							console.log('选择表字段');
						}
					}
				]}
				// value={value}
				onChange={onChange}
				showLineNumbers
			/>
		</div>
	);
};

export default SQLEditor;
