import Graphin, { Behaviors, Utils, GraphinProps } from '@antv/graphin';
const {
	TreeCollapse, // 树图的展开收起
	DragCanvas, // 拖拽画布
	ZoomCanvas, //缩放画布
	ClickSelect, // 点击选中节点
	BrushSelect, //圈选操作
	DragNode, // 拖拽节点
	ResizeCanvas, // 自动调整画布宽高
	LassoSelect, // 拉索操作
	DragCombo, // 拖拽Combo
	ActivateRelations, // 关联高亮
	Hoverable // Hover操作
} = Behaviors;

import React from 'react';

const data = Utils.mock(10).circle().graphin();

const Demo: React.FC = () => {
	const graphinRef = React.createRef();

	React.useEffect(() => {
		const {
			graph, // g6 的Graph实例
			apis // Graphin 提供的API接口
		} = graphinRef.current;
		console.log('ref', graphinRef, graph, apis);
	}, []);

	return (
		<div className="App">
			<Graphin data={data} ref={graphinRef}></Graphin>
		</div>
	);
};
export default Demo;
