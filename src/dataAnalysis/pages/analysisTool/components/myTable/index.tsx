import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { isEmpty, cloneDeep } from 'lodash';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';

interface Props {
	dataSource: any;
	columns: any;
}
const MyTable = (props: Props) => {
	const { dataSource, columns } = props;
	const [newColumns, setNewColumns] = useState(columns);

	const finalData = newColumns.map((col) => {
		col.onHeaderCell = () => ({
			width: col.width,
			onResize: handleResize(col)
		});
		return col;
	});

	const handleResize =
		(column) =>
		(e, { size }) => {
			console.log(size, 272727);
			const data = [...newColumns];
			columns.forEach((item) => {
				if (item.key === column.key) {
					item.width = size.width;
				}
			});
			setNewColumns(data);
		};

	const ResizableTitle = (props) => {
		const { onResize, width, ...restProps } = props;
		if (width === undefined) {
			return <th {...restProps}></th>;
		}
		return (
			<Resizable width={width} height={0} onResize={onResize}>
				<th {...restProps}></th>
			</Resizable>
		);
	};

	const components = {
		header: {
			cell: ResizableTitle
		}
	};

	return (
		<div>
			<Table
				bordered
				dataSource={dataSource}
				columns={finalData}
				components={components}
			/>
		</div>
	);
};

export default MyTable;

// const dataSource = [
// 	{
// 		key: '1',
// 		name: '张三',
// 		age: 32,
// 		address: '西湖区湖底公园1号'
// 	},
// 	{
// 		key: '2',
// 		name: '李四',
// 		age: 42,
// 		address: '西湖区湖底公园1号'
// 	}
// ];

// const columns = [
// 	{
// 		title: '姓名',
// 		dataIndex: 'name',
// 		key: 'name',
// 		width: 110
// 	},
// 	{
// 		title: '年龄',
// 		dataIndex: 'age',
// 		key: 'age',
// 		width: 90
// 	},
// 	{
// 		title: '住址',
// 		dataIndex: 'address',
// 		key: 'address',
// 		width: 220
// 	},
// 	{}
// ];

// const ResizableTitle = (props) => {
// 	const { onResize, width, ...restProps } = props;
// 	if (width === undefined) {
// 		return <th {...restProps}></th>;
// 	}
// 	return (
// 		<Resizable width={width} height={0} onResize={onResize}>
// 			<th {...restProps}></th>
// 		</Resizable>
// 	);
// };

// export default class MyTable extends React.Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			dataSource,
// 			columns: columns.map((col) => {
// 				col.onHeaderCell = () => ({
// 					width: col.width,
// 					onResize: this.handleResize(col)
// 				});
// 				return col;
// 			})
// 		};
// 	}

// 	components = {
// 		header: {
// 			cell: ResizableTitle
// 		}
// 	};

// 	handleResize =
// 		(column) =>
// 		(e, { size }) => {
// 			this.setState(({ columns }) => {
// 				columns.forEach((item) => {
// 					if (item === column) {
// 						item.width = size.width;
// 					}
// 				});

// 				return { columns };
// 			});
// 		};

// 	render() {
// 		return (
// 			<div>
// 				<Table
// 					bordered
// 					dataSource={this.state.dataSource}
// 					columns={this.state.columns}
// 					components={this.components}
// 				/>
// 			</div>
// 		);
// 	}
// }
