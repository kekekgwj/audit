import { useRef, useState } from 'react';
import { Button, Form, Input } from 'antd';
import SvgIcon from '@/components/svg-icon';
import DataTable from '@/components/data-table';
import Show from './components/show';

import styles from './index.module.less';

interface DataType {
	key: string;
	sqlName: string;
	sqlContent: string;
	useTo: string;
}

export default () => {
	const tableRef = useRef();
	const [searchForm] = Form.useForm();
	const [currentRow, setCurrentRow] = useState<DataType>();
	const [openShow, setOpenShow] = useState(false);

	const columns = [
		{
			title: '序号',
			width: 100,
			render: (text, record, index) => index + 1
		},
		{
			title: '审计规则SQL名称',
			width: 300,
			dataIndex: 'sqlName'
		},
		{
			title: '规则用途',
			dataIndex: 'useTo'
		},
		{
			title: '操作',
			key: 'operaion',
			width: 200,
			render: (row, record) => {
				return (
					<div className={styles['operate-box']}>
						<span
							className={styles['operate-item']}
							onClick={() => {
								handleShow(row);
							}}
						>
							<SvgIcon name="see" color="#23955C"></SvgIcon>
							<span style={{ marginLeft: '2px' }}>查看</span>
						</span>
					</div>
				);
			}
		}
	];

	// 打开查看弹框
	const handleShow = (row: DataType) => {
		setCurrentRow(row);
		setOpenShow(true);
	};

	// 关闭查看弹框
	const handleCancelShow = () => {
		setOpenShow(false);
	};

	const getData = (pageIndex: number, pageSize: number) => {
		// console.log(pageIndex, pageSize);
		console.log(searchForm.getFieldsValue());

		const list: DataType[] = [
			{
				key: '1',
				sqlName: 'John Brown',
				sqlContent: 'select * from table11',
				useTo: 'New York No. 1 Lake Park'
			},
			{
				key: '2',
				sqlName: 'Jim Green',
				sqlContent: 'select * from table12',
				useTo: 'London No. 1 Lake Park'
			}
		];
		return {
			list,
			total: 101
		};
	};

	const tableRefresh = () => {
		tableRef.current.refresh();
	};

	const onReset = () => {
		searchForm.resetFields();
		tableRefresh();
	};
	const search = () => {
		tableRefresh();
	};

	return (
		<div style={{ padding: '20px' }}>
			<div className={styles.searchForm}>
				<Form
					form={searchForm}
					labelCol={{ span: 6 }}
					wrapperCol={{ span: 18 }}
					layout="inline"
				>
					<Form.Item
						name="sqlName"
						label="审计规则SQL名称"
						labelCol={{ span: 10 }}
						wrapperCol={{ span: 14 }}
						colon={false}
					>
						<Input placeholder="请输入" />
					</Form.Item>
				</Form>
				<div className={styles['search-handle-box']}>
					<Button htmlType="button" onClick={onReset}>
						重置
					</Button>
					<Button
						onClick={search}
						style={{
							background: '#23955C',
							color: '#fff',
							marginLeft: '10px',
							border: 'none',
							boxShadow: 'none'
						}}
					>
						查询
					</Button>
				</div>
			</div>

			<DataTable ref={tableRef} columns={columns} getData={getData}></DataTable>

			<Show
				open={openShow}
				defaultValue={currentRow}
				cancel={handleCancelShow}
			></Show>
		</div>
	);
};
