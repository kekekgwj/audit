import React, { useEffect, useRef } from 'react';
import { Card, Divider, Form, Input, message, Pagination } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import fileImg from '@/assets/img/file.png';
import styles from './index.module.less';
import SvgIcon from '@/components/svg-icon';
import Delete from '@graph/components/delete-dialog';
import CustomDialog from '@graph/components/custom-dialog';
import {
	getProjects,
	saveProject,
	deleteProject,
	updateProject,
	copyProject
} from '@/api/dataAnalysis/myTemplate';

const MyTemplate = () => {
	const [templateList, setTemplateList] = React.useState([]);
	const [curId, setCurId] = React.useState(); //当前炒作数据id
	const [openDel, setOpenDel] = React.useState(false); // 删除
	const [open, setOpen] = React.useState(false); // 新增or编辑or复制
	const [curTitle, setCurTitle] = React.useState();
	const [total, setTotal] = React.useState<number>(0);
	const [current, setCurrent] = React.useState<number>(1);
	const [form] = Form.useForm();
	useEffect(() => {
		getTemplateList();
	}, []);
	// 获取模板列表数据
	const getTemplateList = async () => {
		const params = { current: current, size: 10 };
		try {
			const res = await getProjects(params);
			setTemplateList(res.records);
			setTotal(res.total);
		} catch (e) {
			console.error(e);
		}
	};

	//删除
	const handleDelete = (item: any) => {
		setOpenDel(true);
		setCurId(item.id);
	};
	const handleCancleDel = () => {
		setOpenDel(false);
	};
	const submitDel = () => {
		deleteProject({ projectId: curId }).then(() => {
			message.success('删除成功');
			setOpenDel(false);
			getTemplateList();
		});
	};

	//编辑
	const handleEdit = (item: any) => {
		setCurId(item.id);
		setCurTitle('模板编辑');
		setOpen(true);
		form.setFieldValue('name', item.name);
	};
	//新增
	const handleAdd = () => {
		setCurId('');
		setCurTitle('新增模板');
		setOpen(true);
	};
	//复制
	const handleCopy = (item: any) => {
		setCurId(item.id);
		setCurTitle('复制模板');
		setOpen(true);
		form.setFieldValue('name', item.name + '_复制');
	};

	const handleOk = () => {
		const data = form.getFieldsValue();
		if (curTitle == '模板编辑') {
			updateProject({ projectId: curId, name: data.name }).then(() => {
				message.success('编辑成功');
				form.resetFields();
				setOpen(false);
				getTemplateList();
			});
		} else if (curTitle == '新增模板') {
			saveProject({ name: data.name }).then(() => {
				message.success('新建成功');
				form.resetFields();
				setOpen(false);
				getTemplateList();
			});
		} else if (curTitle == '复制模板') {
			copyProject({ name: data.name, projectId: curId }).then(() => {
				message.success('复制成功');
				form.resetFields();
				setOpen(false);
				getTemplateList();
			});
		}
	};
	// 取消新增or编辑or复制
	const handleCancel = () => {
		form.resetFields();
		setOpen(false);
	};

	const onChange = (pageNumber: number) => {
		setCurrent(pageNumber);
		getTemplateList();
	};

	return (
		<div className={styles['my-template-page']}>
			<div className={styles['main-contain']}>
				<div className={styles['add-item']}>
					<div
						className={styles['add-content-box']}
						onClick={() => handleAdd()}
					>
						<div>
							<PlusCircleOutlined
								style={{ fontSize: '40px', color: '#24A36F' }}
							></PlusCircleOutlined>
						</div>
						<div className={styles['text-name']}>新建模板</div>
					</div>
				</div>
				{templateList &&
					templateList.length > 0 &&
					templateList.map((item) => {
						return (
							<Card key={item.id} className={styles['card-item']}>
								<div className={styles['card-content']}>
									<div className={styles['img-icon']}>
										<img src={fileImg} alt="" />
									</div>
									<div className={styles['text-name']}>{item.name}</div>
									<div className={styles['text-time']}>
										最近更新：{item.gmtModified}
									</div>
								</div>
								<div className={styles['card-footer']}>
									<span
										className={styles['operate-item']}
										onClick={() => handleCopy(item)}
									>
										<SvgIcon name="copy" color="#24A36F"></SvgIcon>
										<span style={{ marginLeft: '2px' }}>复制</span>
									</span>
									<span>
										<Divider type="vertical" />
									</span>
									<span
										className={styles['operate-item']}
										onClick={() => handleEdit(item)}
									>
										<SvgIcon name="edit" color="#24A36F"></SvgIcon>
										<span style={{ marginLeft: '2px' }}>编辑</span>
									</span>
									<span>
										<Divider type="vertical" />
									</span>
									<span
										className={styles['operate-item']}
										onClick={() => handleDelete(item)}
									>
										<SvgIcon name="delete" color="#24A36F"></SvgIcon>
										<span style={{ marginLeft: '2px' }}>删除</span>
									</span>
								</div>
							</Card>
						);
					})}
			</div>

			<div className={styles['foot-pagination-box']}>
				<div>
					<span style={{ marginRight: '10px' }}>共{total}条记录</span>
					<span>
						第{current}/{Math.ceil(total / 10)}页
					</span>
				</div>
				<div className={styles['pagination-box']}>
					<Pagination
						total={total}
						showSizeChanger
						pageSizeOptions={[10]}
						onChange={onChange}
						showQuickJumper
					/>
				</div>
			</div>
			<Delete
				open={openDel}
				handleCancle={handleCancleDel}
				onOk={submitDel}
			></Delete>
			<CustomDialog
				open={open}
				title={curTitle}
				width={600}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<Form
					form={form}
					labelCol={{ span: 4 }}
					wrapperCol={{ span: 20 }}
					labelAlign="left"
				>
					<Form.Item
						label="模板名称"
						name="name"
						rules={[{ required: true, message: '请输入名称' }]}
					>
						<Input />
					</Form.Item>
				</Form>
			</CustomDialog>
		</div>
	);
};

export default MyTemplate;
