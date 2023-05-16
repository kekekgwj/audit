import React, { useContext, useEffect, useRef, useState } from 'react';
import Graphin, {
	Components,
	IG6GraphEvent,
	GraphinContext,
	type TooltipValue,
	type GraphinData,
	type LegendChildrenProps
} from '@antv/graphin';
// import registerNodes from './custom-node';
// import registerEdges from './custom-edge';
import styles from './index.module.less';
import { INode, ModelConfig, NodeConfig } from '@antv/g6';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { Checkbox, Input, Col, Row, message, Form } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomDialog from '@graph/components/custom-dialog';
import { getGraphByRule } from '@/api/knowledgeGraph/suspiciousRule';

// 注册自定义节点
// registerNodes('all');
// registerEdges('all');

//功能组件
const { Tooltip, ContextMenu, Legend } = Components;

interface Props {
	data: GraphinData;
	refersh: boolean;
	updateData: (data: GraphinData) => void;
	onClose: () => void;
	id?: string;
}

interface MenuProps {
	onClose: () => void;
	updateData: (data: GraphinData) => void;
	id?: string;
}

interface NodeDetailProps {
	nodeModel: ModelConfig;
}

interface SaveProps {}

// 保存图谱
const SaveCom = React.memo((props: SaveProps) => {
	const [messageApi, contextHolder] = message.useMessage();
	const [form] = Form.useForm();
	const { open, file, defaultName, setSaveOpen } = props;

	useEffect(() => {
		if (open) {
			initForm();
		}
	}, [open]);

	const initForm = () => {
		form.setFieldValue('name', defaultName);
	};

	// 提交表单
	const handleOk = () => {
		const data = form.getFieldsValue();
		const formData = new FormData();
		formData.append('picFile', file);
		formData.append('name', data.name);
		saveGraph(formData).then((res) => {
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

const GraphinCom = React.memo((props: Props) => {
	const { data, updateData, refersh } = props;
	const [key, setKey] = useState('');
	const [width, setWidth] = useState(600);
	const graphinRef = useRef<HTMLDivElement>();

	return (
		<div ref={graphinRef} className={styles['graphin-box']}>
			<Graphin
				key={key}
				data={data}
				width={width}
				layout={{
					type: 'force',
					preventOverlap: true,
					nodeSize: 140,
					nodeSpacing: 50
				}}
			>
				<Legend bindType="node" sortKey="typeName">
					{(renderProps: LegendChildrenProps) => {
						return <Legend.Node {...renderProps} />;
					}}
				</Legend>
			</Graphin>
		</div>
	);
});

const GraphCom = () => {
	const navigate = useNavigate();
	let location = useLocation();
	// 传入数据 根据此数据获取图谱数据
	const formData = location.state;
	// 图谱数据来源
	const [data, setDate] = useState<GraphinData>();
	const graphinRef = useRef<GraphinRef>();
	const [open, setSaveOpen] = React.useState(false);
	const [file, setFile] = React.useState();
	const [defaultName, setdefaultName] = React.useState();

	useEffect(() => {
		getGraphinData();
	}, []);

	// 获取图谱数据
	const getGraphinData = async () => {
		const data = await getGraphByRule({ auditRuleParams: '' });
		updateData(data);
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
			setFile(file);
			//调用后端接口，将文件传给后端
			setSaveOpen(true);
		});
	};

	const toggleBarLayout = (isOpen: boolean) => {
		setBarOpen(isOpen);
		// graphinRef?.current?.refersh();
	};

	return (
		<div className={styles['main-content']}>
			<div className={styles['graphin-box']}>
				{data && (
					<>
						<div className={styles['graphin-box__com']}>
							<GraphinCom data={data}></GraphinCom>
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
				file={file}
				setSaveOpen={setSaveOpen}
			></SaveCom>
		</div>
	);
};

export default GraphCom;
