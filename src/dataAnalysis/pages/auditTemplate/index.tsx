import React, { useEffect, useRef } from 'react';
import { Card, Divider, Form, Input, Pagination, Empty, message } from 'antd';
import fileImg from '@/assets/img/file.png';
import styles from './index.module.less';
import SvgIcon from '@/components/svg-icon';
import CustomDialog from '@/components/custom-dialog';
import emptyPage from '@/assets/img/empty.png';
import {
	getAuditProjects,
	copyAuditProject
} from '@/api/dataAnalysis/auditTemplate';
import { useNavigate } from 'react-router-dom';

const AuditTemplate = () => {
	const [messageApi, contextHolder] = message.useMessage();
	const [templateList, setTemplateList] = React.useState([]);
	const [curId, setCurId] = React.useState<number>();
	const [openCopy, setOpenCopy] = React.useState<boolean>(false);
	const [current, setCurrent] = React.useState<number>(1); //当前页
	const [totalPage, setTotalPage] = React.useState<number>(1); //总页数
	const [pageSize, setPageSize] = React.useState<number>(10); //每页数量
	const [hasData, setHasData] = React.useState<boolean>(false);
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const sizeRef = useRef();
	const totalPageRef = useRef();
	const currentRef = useRef();
	const templateListRef = useRef();
	useEffect(() => {
		sizeRef.current = pageSize;
	}, [pageSize]);
	useEffect(() => {
		currentRef.current = current;
	}, [current]);
	useEffect(() => {
		totalPageRef.current = totalPage;
	}, [totalPage]);
	useEffect(() => {
		templateListRef.current = templateList;
	}, [templateList]);
	useEffect(() => {
		// getTemplateList();
		const dom = document.querySelector('#mianbox');
		// 当前界面每行可容纳个数
		const rowNum = Math.floor(dom?.scrollWidth / 220);
		// 每列可容纳个数
		const colNum = Math.floor(dom?.scrollHeight / 220);
		//每页数量
		let size = rowNum * colNum;
		setPageSize(size);
		//第一次获取数据
		const params = { current: currentRef.current, size: size };
		getAuditProjects(params).then((res: any) => {
			setTemplateList(res.records);
			setTotalPage(Math.ceil(res.total / size));
			if (res.records && res.records.length > 0) {
				//有数据 添加监听事件
				setHasData(true);
			}
		});
	}, []);
	useEffect(() => {
		if (hasData) {
			// 添加监听事件
			const el = document.querySelector('#mainContain');
			el?.addEventListener('scroll', handleScroll);
			return () => {
				el?.removeEventListener('scroll', handleScroll);
			};
		}
	}, [hasData]);

	const handleScroll = () => {
		let dom = document.querySelector('#mainContain');
		const scrollDistance =
			dom?.scrollHeight - dom?.scrollTop - dom?.clientHeight;
		console.log(scrollDistance, 767676);
		if (scrollDistance <= 5) {
			//等于0证明已经到底，可以请求接口
			if (currentRef?.current < totalPageRef?.current) {
				//当前页数小于总页数就请求
				setCurrent(currentRef?.current + 1); //当前页数自增
				const nowPage = currentRef?.current + 1;
				//请求接口的代码
				getTemplateListMore(nowPage);
			}
		}
	};

	//懒加载更多数据
	const getTemplateListMore = async (page: number) => {
		const params = { current: page, size: sizeRef.current };
		try {
			const res = await getAuditProjects(params);
			setTemplateList([...templateListRef.current, ...res.records]);
		} catch (e) {
			console.error(e);
		}
	};
	// 获取模板列表数据
	const getTemplateList = async () => {
		const params = {
			current: 1,
			size: 10
		};
		try {
			const res = await getAuditProjects(params);
			setTemplateList(res.records);
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
				messageApi.open({
					type: 'success',
					content: '复制成功'
				});
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

	const toDetail = (item: any) => {
		navigate('/sql/dataVisualization/templateDetail', {
			state: { name: item.name, id: item.id, path: '审计模板' }
		});
	};

	return (
		<div className={styles['audit-template-page']}>
			{contextHolder}
			<div className={styles['main-box']} id="mianbox">
				{templateList?.length > 0 ? (
					<div className={styles['template-list-page']}>
						<div className={styles['main-contain']} id="mainContain">
							{templateList.map((item) => {
								return (
									<Card key={item.id} className={styles['card-item']}>
										<div
											className={styles['card-content']}
											onClick={() => toDetail(item)}
										>
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
						{/* <div className={styles['foot-pagination-box']}>
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
						</div> */}
					</div>
				) : (
					<Empty
						image={emptyPage}
						description={false}
						imageStyle={{ height: '193px' }}
					/>
				)}
			</div>
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
