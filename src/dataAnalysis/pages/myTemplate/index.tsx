import React, { useEffect, useRef } from 'react';
import {
	Card,
	Divider,
	Form,
	Input,
	message,
	Pagination,
	Col,
	Row
} from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlusCircleOutlined } from '@ant-design/icons';
import fileImg from '@/assets/img/file.png';
import styles from './index.module.less';
import SvgIcon from '@/components/svg-icon';
import Delete from '@/components/delete-dialog';
import CustomDialog from '@/components/custom-dialog';
import {
	getProjects,
	saveProject,
	deleteProject,
	updateProject,
	copyProject
} from '@/api/dataAnalysis/myTemplate';

const MyTemplate = () => {
	const location = useLocation();

	if (location.pathname === '/sql/dataVisualization/myTemplate') {
		const searchParams = new URLSearchParams(location.search);

		localStorage.setItem('token', searchParams.get('token') || '');
	}

	const [templateList, setTemplateList] = React.useState([]);
	const [curId, setCurId] = React.useState(); //当前炒作数据id
	const [openDel, setOpenDel] = React.useState(false); // 删除
	const [open, setOpen] = React.useState(false); // 新增or编辑or复制
	const [curTitle, setCurTitle] = React.useState();
	const [totalPage, setTotalPage] = React.useState<number>(1); //总页数
	const [current, setCurrent] = React.useState<number>(1);
	const [pageSize, setPageSize] = React.useState<number>(10);
	const [form] = Form.useForm();
	const navigate = useNavigate();
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
	//获取内容区域
	useEffect(() => {
		const dom = document.querySelector('#mainContain');
		// 当前界面每行可容纳个数
		// md={12} lg={8} xl={6} xxl={4}
		let rowNum;
		if (dom?.scrollWidth < 992) {
			rowNum = 2;
		} else if (dom?.scrollWidth < 1200 && dom?.scrollWidth >= 992) {
			rowNum = 3;
		} else if (dom?.scrollWidth < 1600 && dom?.scrollWidth >= 1200) {
			rowNum = 4;
		} else {
			rowNum = 6;
		}
		// 每列可容纳个数
		const colNum = Math.floor(dom?.scrollHeight / 220);
		//每页数量
		const size = rowNum * colNum;
		setPageSize(size);
		//第一次获取数据
		getTemplateListFirst(size);
		//监听滚动
		dom?.addEventListener('scroll', handleScroll);
		return () => {
			dom?.removeEventListener('scroll', handleScroll);
		};
	}, []);

	// 滚动事件
	const handleScroll = () => {
		const dom = document.querySelector('#mainContain');
		const scrollDistance =
			dom?.scrollHeight - dom?.scrollTop - dom?.clientHeight;
		console.log(scrollDistance, 696969);
		if (scrollDistance <= 5) {
			//细小误差导致不能到0，取一个较小值
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
	// 初始获取数据
	const getTemplateListFirst = async (size: number) => {
		const params = { current: currentRef.current, size: size };
		try {
			const res = await getProjects(params);
			setTemplateList(res.records);
			setTotalPage(Math.ceil(res.total / size));
		} catch (e) {
			console.error(e);
		}
	};

	// 获取更多数据
	const getTemplateListMore = async (page: number) => {
		const params = { current: page, size: sizeRef.current };
		try {
			const res = await getProjects(params);
			console.log(templateListRef.current, 939393);
			setTemplateList([...templateListRef.current, ...res.records]);
		} catch (e) {
			console.error(e);
		}
	};

	//更新界面数据
	const getTemplateList = async () => {
		// 需要重置到显示第一页数据 需要重置总页数
		setCurrent(1);
		const params = { current: 1, size: sizeRef.current };
		try {
			const res = await getProjects(params);
			setTemplateList(res.records);
			setTotalPage(Math.ceil(res.total / sizeRef?.current));
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
		setCurTitle('新建模板');
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
		} else if (curTitle == '新建模板') {
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

	const toDetail = (item: any) => {
		navigate('/sql/dataVisualization/templateDetail', {
			state: { name: item.name, id: item.id, path: '我的模板' }
		});
	};

	const date2str = (str) => str.replace(/-/gi, '/');

	return (
		<div className={styles['my-template-page']}>
			<div className={styles['main-contain']} id="mainContain">
				<Row gutter={20} style={{ width: '100%' }}>
					<Col xs={12} sm={12} md={12} lg={8} xl={6} xxl={4}>
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
					</Col>
					{templateList &&
						templateList.length > 0 &&
						templateList.map((item) => {
							return (
								<Col xs={12} sm={12} md={12} lg={8} xl={6} xxl={4}>
									<Card key={item.id} className={styles['card-item']}>
										<div
											className={styles['card-content']}
											onClick={() => toDetail(item)}
										>
											<div className={styles['img-icon']}>
												<img src={fileImg} alt="" />
											</div>
											<div className={styles['text-name']}>{item.name}</div>
											<div
												style={{ textAlign: 'center' }}
												className={styles['text-time']}
											>
												最近更新
												<br></br>
												{item.gmtModified}
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
								</Col>
							);
						})}
				</Row>
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
