import React, { useEffect, useRef } from 'react';
import { Card, Divider, Form, Input, Pagination, Empty } from 'antd';
import fileImg from '@/assets/img/file.png';
import styles from './index.module.less';
import SvgIcon from '@/components/svg-icon';
import CustomDialog from '@graph/components/custom-dialog';
import emptyPage from '@/assets/img/empty.png';
import {
	getAuditProjects,
	copyAuditProject
} from '@/api/dataAnalysis/auditTemplate';

const AuditTemplate = () => {
	const [templateList, setTemplateList] = React.useState([]);
	const [curId, setCurId] = React.useState<number>();
	const [openCopy, setOpenCopy] = React.useState<boolean>(false);
	const [total, setTotal] = React.useState<number>(2);
	const [current, setCurrent] = React.useState<number>(1);
	const [form] = Form.useForm();
	useEffect(() => {
		getTemplateList();
	}, []);
	// 获取模板列表数据
	const getTemplateList = async () => {
		const params = {
			current: 1,
			size: 10
		};
		try {
			const res = await getAuditProjects(params);
			setTemplateList(res.records);
			// const data = [
			// 	{ name: '模板一', gmtModified: '2023-05-24', id: 1 },
			// 	{ name: '模板二', gmtModified: '2023-05-24', id: 2 }
			// ];
			// setTemplateList(data);
		} catch (e) {
			console.error(e);
		}
	};

	//复制
	const handleCopy = (item: any) => {
		console.log(item, 4141);
		setCurId(item.id);
		setOpenCopy(true);
		form.setFieldValue('name', item.name + '_复制');
	};

	const handleOk = () => {
		const data = form.getFieldValue();
		form.validateFields().then(() => {
			copyAuditProject({ auditProjectId: curId, name: data.name }).then(() => {
				message.success('复制成功');
				form.resetFields();
				setOpenCopy(false);
				getTemplateList();
			});
		});
	};

	const handleCancel = () => {
		form.resetFields();
		setOpenCopy(false);
	};
	const onChange = (pageNumber: number) => {
		setCurrent(pageNumber);
		getTemplateList();
	};

	return (
		<div className={styles['audit-template-page']}>
			{templateList?.length > 0 ? (
				<div className={styles['template-list-page']}>
					<div className={styles['main-contain']}>
						{templateList.map((item) => {
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
				</div>
			) : (
				<Empty
					image={emptyPage}
					description={false}
					imageStyle={{ height: '193px' }}
				/>
			)}
			<CustomDialog
				open={openCopy}
				title="复制模板"
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

export default AuditTemplate;
