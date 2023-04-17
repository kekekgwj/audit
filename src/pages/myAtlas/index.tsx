import React, { useEffect } from 'react';
import {
	Table,
	Space,
	Pagination,
	Form,
	Input,
	Button,
	Modal,
	Select,
	ConfigProvider,
	DatePicker,
	Empty
} from 'antd';
const { RangePicker } = DatePicker;
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import './atlas.less';

// const BlankCom = React.memo(() => {
// 	return;
// });

const MyTableCom = React.memo(() => {
	// 查看
	const handleDetail = () => {};

	// 删除
	const handleDelete = () => {};

	const colums = [
		{
			title: '序号',
			dataIndex: 'key'
		},
		{
			title: '规则名称',
			dataIndex: 'ruleName'
		},
		{
			title: '规则用途',
			dataIndex: 'ruleUse'
		},
		{
			title: '操作',
			key: 'operaion',
			render: (row, record) => {
				return (
					<div>
						<span
							onClick={() => handleDetail(row, record.key)}
							style={{ cursor: 'pointer', marginRight: '10px' }}
						>
							<Space>
								<EyeOutlined style={{ color: '#23955C' }} />
							</Space>
							<span style={{ marginLeft: '2px' }}>查看</span>
						</span>
						<span
							onClick={() => handleDelete(row, record.key)}
							style={{ cursor: 'pointer' }}
						>
							<Space>
								<DeleteOutlined style={{ color: '#23955C' }} />
							</Space>
							<span style={{ marginLeft: '2px' }}>删除</span>
						</span>
					</div>
				);
			}
		}
	];
	const data = [
		{
			key: '1',
			ruleName: '胡彦斌111',
			ruleUse: '西湖区湖底公园1号'
		},
		{
			key: '2',
			ruleName: '胡彦祖1111',
			ruleUse: '西湖区湖底公园1号'
		}
	];
	return (
		<div>
			<Table
				columns={colums}
				dataSource={data}
				pagination={{ position: ['none'] }}
			></Table>
			<div
				style={{
					textAlign: 'center',
					marginTop: '20px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between'
				}}
			>
				<div>
					<span style={{ marginRight: '10px' }}>共85条记录</span>
					<span>第1/50页</span>
				</div>
				<Pagination total={85} showSizeChanger showQuickJumper />
			</div>
		</div>
	);
});

const MyAtlasCom = () => {
	// 是否显示表
	const [showTable, setShowTable] = React.useState(false);

	const [form] = Form.useForm();

	const onReset = () => {
		form.resetFields();
		setShowTable(false);
	};
	const search = (res) => {
		console.log(res);
		setShowTable(true);
	};

	return (
		<div className="altasContent">
			<div className="searchForm">
				<Form
					form={form}
					labelCol={{ span: 6 }}
					wrapperCol={{ span: 18 }}
					layout="inline"
					onFinish={(res: any) => {
						search(res);
					}}
				>
					<Form.Item name="mainType" label="图谱名称">
						<Input />
					</Form.Item>

					<Form.Item name="range-picker" label="创建时间">
						<RangePicker format="YYYY-MM-DD" />
					</Form.Item>

					<Form.Item>
						<Button htmlType="button" onClick={onReset}>
							重置
						</Button>
					</Form.Item>
					<Form.Item>
						<Button
							htmlType="submit"
							style={{ background: '#23955C', color: '#fff' }}
						>
							查询
						</Button>
					</Form.Item>
				</Form>
			</div>
			{showTable ? <MyTableCom /> : <Empty />}
		</div>
	);
};
export default MyAtlasCom;
