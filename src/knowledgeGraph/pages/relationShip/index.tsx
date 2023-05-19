import React, { Ref, useEffect, useRef, useState } from 'react';
import { Button, message, Input, Form, Row, Col } from 'antd';
import { type GraphinData } from '@antv/graphin';
import html2canvas from 'html2canvas';
import GraphinCom from '@graph/components/graphin';
import SideBar from '@graph/components/sidebar/sideBar';
import { toImgStyle } from '@/utils/other';
import styles from './index.module.less';
import { saveGraph, uploadGraphPic } from '@/api/knowLedgeGraph/graphin';
import CustomDialog from '@graph/components/custom-dialog';

interface SaveProps {
	open: boolean;
	fileUrl: string;
	defaultName: string;
	setSaveOpen: (open: boolean) => void;
}
const SaveCom = React.memo((props: SaveProps) => {
	const [messageApi, contextHolder] = message.useMessage();
	const [form] = Form.useForm();
	const { open, fileUrl, defaultName, setSaveOpen } = props;

	useEffect(() => {
		if (open) {
			console.log(defaultName, 187187);
			initForm();
		}
	}, [open]);

	const initForm = () => {
		form.setFieldValue('name', defaultName);
	};

	// 提交表单
	const handleOk = () => {
		const data = form.getFieldsValue();
		const submitData = {
			name: data.name,
			picUrl: fileUrl
		};
		saveGraph(submitData).then((res) => {
			messageApi.open({
				type: 'success',
				content: '保存成功'
			});
			setSaveOpen(false);
		});
	};

	const handleCancel = () => {
		form.resetFields();
		setSaveOpen(false);
	};

	return (
		<div>
			<CustomDialog
				open={open}
				title="保存图谱"
				width={600}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
					<Form.Item name="name" label="图谱名称" style={{ marginBottom: 0 }}>
						<Input />
					</Form.Item>
					<Row className={styles['notice-tips']}>
						<Col span={4}></Col>
						<Col span={20}> 注：点击确认，该图谱将保存至我的图谱</Col>
					</Row>
				</Form>
			</CustomDialog>
			{contextHolder}
		</div>
	);
});

interface GraphinRef {
	refersh: () => void;
}

const RelationShipCom = () => {
	// 数据来源
	const [data, setDate] = useState<GraphinData>();
	const [barOpen, setBarOpen] = useState(true);
	const graphinRef = useRef<GraphinRef>();
	const [open, setSaveOpen] = React.useState(false);
	const [fileUrl, setFile] = React.useState();
	const [defaultName, setdefaultName] = React.useState();

	useEffect(() => {
		getGraphinData();
	}, []);

	const getGraphinData = async () => {
		updateData(''); //设置初始值为空
	};

	// 更新数据
	const updateData = (value: GraphinData) => {
		setDate(value);
	};

	// 保存图谱
	const saveGraph = () => {
		window.pageYOffset = 0; //网页位置
		document.documentElement.scrollTop = 0; //滚动条的位置
		document.body.scrollTop = 0; //网页被卷去的高
		//获取要生成图片的dom区域并转为canvas;
		html2canvas(document.querySelector('#graphin-container')).then((canvas) => {
			const base64Img = canvas.toDataURL('image/png'); //将canvas转为base64

			const file = toImgStyle(base64Img, Date.now() + '.png');
			//调用后端接口，将文件传给后端
			const formData = new FormData();
			formData.append('file', file);
			uploadGraphPic(formData).then((res) => {
				console.log(res, 123123123);
				setFile(res);
				setSaveOpen(true);
			});
		});
	};

	const toggleBarLayout = (isOpen: boolean) => {
		setBarOpen(isOpen);
		// graphinRef?.current?.refersh();
	};

	return (
		<div
			style={{
				paddingLeft: barOpen ? '330px' : '0'
			}}
			className={styles['main-content']}
		>
			<div
				style={{
					height: barOpen ? '100%' : '0'
				}}
				className={styles['filter-bar']}
			>
				<SideBar
					updateData={updateData}
					toggleLayout={toggleBarLayout}
					canAdd={true}
					setdefaultName={setdefaultName}
				></SideBar>
			</div>
			<div className={styles['graphin-box']}>
				{data && (
					<>
						<div className={styles['graphin-box__com']}>
							<GraphinCom
								// ref={graphinRef}
								data={data}
								refersh={barOpen}
								updateData={updateData}
								onClose={() => {}}
							></GraphinCom>
						</div>
						<div className={styles['graphin-box__btn']}>
							<Button
								htmlType="button"
								style={{ background: '#23955C', color: '#fff' }}
								onClick={() => {
									saveGraph();
								}}
							>
								保存图谱
							</Button>
						</div>
					</>
				)}
			</div>
			<SaveCom
				open={open}
				defaultName={defaultName}
				fileUrl={fileUrl}
				setSaveOpen={setSaveOpen}
			></SaveCom>
		</div>
	);
};

export default RelationShipCom;
