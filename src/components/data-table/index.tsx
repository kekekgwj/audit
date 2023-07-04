import { Pagination, Empty } from 'antd';
import Table from 'antd/es/table';
import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState
} from 'react';
import emptyPage from '@/assets/img/newEmpty.png';
import styles from './index.module.less';

interface Props {
	className?: string;
	columns: Array<any>;
	scroll: boolean;
	getData: (
		pageIndex: number,
		pageSize: number
	) => { list: any[]; total: number };
}

const DataTable = forwardRef((props: Props, ref) => {
	const { className, columns, scroll = false, getData } = props;

	columns.forEach((col) => {
		if (col.type === 'globalIndex') {
			col.render = (text, record, index) =>
				`${(pagination.pageIndex - 1) * pagination.pageSize + index + 1}`;
		}
	});

	const tabRef = useRef(null);
	const [scrollHeight, setScrollHeight] = useState(0);
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
		getScrollHeight();
		getTableData(pagination.pageIndex, pagination.pageSize);
	}, []);

	// 计算表格滚动高度
	const getScrollHeight = () => {
		if (!tabRef.current || !scroll) return;
		const bound = tabRef.current.getBoundingClientRect();
		const height = bound.height - 105;
		setScrollHeight(height);
	};

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
		<div ref={tabRef} className={`${styles['data-table']} ${className}`}>
			{dataSource.length ? (
				<>
					<Table
						columns={columns}
						dataSource={dataSource}
						loading={loading}
						pagination={false}
						scroll={{ y: scroll ? scrollHeight : 'auto' }}
						className={styles['data-table__table']}
					/>
					<div className={styles['data-table__pagination']}>
						<div>
							<span style={{ marginRight: '10px' }}>共{total}条记录</span>
							<span>
								第{pagination.pageIndex}/
								{Math.ceil(total / pagination.pageSize)}页
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
				</>
			) : (
				<Empty
					className={styles['empty']}
					image={emptyPage}
					description={
						<div className={styles['empty-tip-box']}>
							<div className={styles['empty-tip1']}>暂无数据</div>
							<div className={styles['empty-tip2']}>数据空空如也~</div>
						</div>
					}
				/>
			)}
		</div>
	);
});

export default DataTable;
