import React, { useEffect, useRef } from 'react';
import { Card, Divider, Form, Input } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import fileImg from '@/assets/img/file.png';
import styles from './index.module.less';
import SvgIcon from '@/components/svg-icon';
import Delete from '@graph/components/delete-dialog';
import CustomDialog from '@graph/components/custom-dialog';

const MyTemplate = () => {
	const [templateList, setTemplateList] = React.useState([]);
	const [curId, setCurId] = React.useState(); //当前炒作数据id
	const [openDel, setOpenDel] = React.useState(false); // 删除
	const [open, setOpen] = React.useState(false); // 新增or编辑
	const [curTitle, setCurTitle] = React.useState();
	const [form] = Form.useForm();
	useEffect(() => {
		getTemplateList();
	}, []);
	// 获取模板列表数据
	const getTemplateList = () => {
		const data = [
			{ name: '模板一', createTime: '2023-05-23', id: 1 },
			{ name: '模板二', createTime: '2023-05-23', id: 2 },
			{ name: '模板三', createTime: '2023-05-23', id: 3 }
		];
		setTemplateList(data);
	};

	//删除
	const handleDelete = (item) => {
		setOpenDel(true);
		setCurId(item.id);
	};
	const handleCancleDel = () => {
		setOpenDel(false);
	};
	const submitDel = () => {
		console.log(curId, 353535);
	};

	//编辑
	const handleEdit = (item) => {
		setCurId(item.id);
		setCurTitle('模板编辑');
		setOpen(true);
		form.setFieldValue('temName', item.name);
	};
	//新增
	const handleAdd = () => {
		setCurId('');
		setCurTitle('新增模板');
		setOpen(true);
	};

	const handleOk = () => {
		if (curTitle == '模板编辑') {
			console.log('编辑');
		} else {
			console.log('新增');
		}
	};
	// 取消新增or编辑
	const handleCancel = () => {
		form.resetFields();
		setOpen(false);
	};

	//复制
	const handleCopy = (item) => {
		console.log(item.id, 7171);
	};

	return (
		<div className={styles['my-template-page']}>
			<Card className={styles['card-item']}>
				<div className={styles['add-content-box']} onClick={() => handleAdd()}>
					<div>
						<PlusCircleOutlined
							style={{ fontSize: '40px', color: '#24A36F' }}
						></PlusCircleOutlined>
					</div>
					<div className={styles['text-name']}>新建模板</div>
				</div>
			</Card>
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
									最近更新：{item.createTime}
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
						name="temName"
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
