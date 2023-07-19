import React, { useEffect, useRef, useState } from 'react';
import { Table } from 'antd';
import { Resizable } from 'react-resizable';
import './style.less';

// 调整table表头
const ResizeableTitle = (props) => {
	const { onResize, width, ...restProps } = props;

	if (!width) {
		return <th {...restProps} />;
	}

	return (
		<Resizable
			width={width}
			height={0}
			onResize={onResize}
			draggableOpts={{ enableUserSelectHack: false }}
		>
			<th {...restProps} />
		</Resizable>
	);
};
// 定义头部组件
const components = {
	header: {
		cell: ResizeableTitle
	}
};
// 拖拽调整table
interface Props {
	columnsData: any;
	dataSource: any;
	loading: boolean;
	searchChange: (page: number) => void;
	current: number;
	total: number;
}
const ResizeTable: React.FC<Props> = (props: Props) => {
	// table 数据
	const {
		columnsData,
		dataSource,
		loading,
		searchChange,
		current,
		total,
		panelHeight
	} = props;

	// const [columns, setColumns] = useState(formatCol(columnsData));

	// function formatCol(cols) {
	// 	return (cols || []).map((col, index) => ({
	// 		...col,
	// 		onHeaderCell: (column) => ({
	// 			width: column.width,
	// 			onResize: handleResize(index)
	// 		})
	// 	}));
	// }
	// // 处理拖拽
	// const handleResize =
	// 	(index) =>
	// 	(e, { size }) => {
	// 		const nextColumns = [...columns];
	// 		// 拖拽时调整宽度
	// 		nextColumns[index] = {
	// 			...nextColumns[index],
	// 			width: size.width
	// 		};
	// 		setColumns(formatCol(nextColumns));
	// 	};

	// 测试
	const tabRef = useRef(null);
	const [cols, setCols] = useState(columnsData);
	const [columns, setColumns] = useState([]);

	const [scrollHeight, setScrollHeight] = useState(0);
	// 处理拖拽
	const handleResize =
		(index) =>
		(e, { size }) => {
			const nextColumns = [...cols];
			// 拖拽时调整宽度
			nextColumns[index] = {
				...nextColumns[index],
				width: size.width
			};

			setCols(nextColumns);
		};

	useEffect(() => {
		setColumns(
			(cols || []).map((col, index) => ({
				...col,
				onHeaderCell: (column) => ({
					width: column.width,
					onResize: handleResize(index)
				})
			}))
		);
	}, [cols]);

	useEffect(() => {
		getScrollHeight();
	}, [panelHeight]);

	// 计算表格滚动高度
	const getScrollHeight = () => {
		if (!tabRef.current || !scroll) return;
		const bound = tabRef.current.getBoundingClientRect();
		const height = bound.height - (total ? 80 : 0);
		setScrollHeight(height);
	};

	return (
		<div ref={tabRef} className="components-table-resizable-column">
			<Table
				size="small"
				bordered
				showHeader={!!total}
				loading={loading}
				components={components}
				columns={columns}
				dataSource={dataSource}
				// scroll={{ y: total ? 240 : 300 }}
				scroll={{ y: scrollHeight }}
				pagination={
					total
						? {
								current,
								total,
								showSizeChanger: false,
								pageSize: 10,
								onChange: (page) => {
									searchChange(page);
								}
						  }
						: false
				}
			/>
		</div>
	);
};

export default ResizeTable;
