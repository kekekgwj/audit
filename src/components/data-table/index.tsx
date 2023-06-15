import { Pagination } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import styles from './index.module.less';

interface Props {
	columns: ColumnsType<any>;
	getData: (
		pageIndex: number,
		pageSize: number
	) => { list: any[]; total: number };
}

const DataTable = forwardRef((props: Props, ref) => {
	const { columns, getData } = props;

	const [dataSource, setDataSource] = useState([]);
	const [pagination, setPagination] = useState({
		pageIndex: 1,
		pageSize: 10
	});
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);

	useImperativeHandle(ref, () => ({
		// 刷新
		refresh: () => {
			setPagination({
				pageIndex: 1,
				pageSize: 10
			});
			getTableData(1, 10);
		}
	}));

	useEffect(() => {
		getTableData(pagination.pageIndex, pagination.pageSize);
	}, []);

	const getTableData = async (pageIndex: number, pageSize: number) => {
		setLoading(true);
		try {
			const { list, total } = await getData(pageIndex, pageSize);
			setDataSource(list);
			setTotal(total);
		} catch (e) {
			console.log(e);
		}

		setLoading(false);
	};

	const onChangePagination = (current: number, size: number) => {
		setPagination({
			...pagination,
			pageIndex: current,
			pageSize: size
		});
		getTableData(current, size);
	};

	return (
		<div className={styles['data-table']}>
			<Table
				columns={columns}
				dataSource={dataSource}
				loading={loading}
				pagination={false}
				className={styles['data-table__table']}
			/>
			{dataSource.length ? (
				<div className={styles['data-table__pagination']}>
					<div>
						<span style={{ marginRight: '10px' }}>共{total}条记录</span>
						<span>
							第{pagination.pageIndex}/{Math.ceil(total / pagination.pageSize)}
							页
						</span>
					</div>
					<Pagination
						current={pagination.pageIndex}
						total={total}
						pageSize={pagination.pageSize}
						showSizeChanger
						onChange={onChangePagination}
						showQuickJumper
					/>
				</div>
			) : null}
		</div>
	);
});

export default DataTable;
