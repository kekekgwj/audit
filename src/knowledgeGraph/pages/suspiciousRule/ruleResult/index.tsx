import React, { useContext, useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { toImgStyle } from '@/utils/other';
import Graphin, {
	Components,
	type TooltipValue,
	type GraphinData,
	type LegendChildrenProps
} from '@antv/graphin';
// import registerNodes from './custom-node';
// import registerEdges from './custom-edge';
import SvgIcon from '@/components/svg-icon';
import styles from './index.module.less';
import { INode, ModelConfig, NodeConfig } from '@antv/g6';
import { Checkbox, Input, Col, Row, message, Form, Table, Button } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomDialog from '@graph/components/custom-dialog';
import { saveGraph, uploadGraphPic } from '@/api/knowLedgeGraph/graphin';
import { getGraphByRule } from '@/api/knowLedgeGraph/suspiciousRule';

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

interface SaveProps {
	open: boolean;
	fileUrl: string;
	defaultName: string;
	orData: [];
	setSaveOpen: (open: boolean) => void;
	ruleId: string; //规则id
	ruleName: string; //规则名称
	head: []; //表头
}

// 保存图谱
const SaveCom = React.memo((props: SaveProps) => {
	const [messageApi, contextHolder] = message.useMessage();
	const [form] = Form.useForm();
	const {
		open,
		fileUrl,
		defaultName,
		ruleId,
		head,
		ruleName,
		orData,
		setSaveOpen
	} = props;

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
		const submitData = {
			name: data.name,
			picUrl: fileUrl,
			ruleId: ruleId,
			ruleName: ruleName,
			head: head,
			data: orData
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

const GraphinCom = React.memo((props: Props) => {
	const { data, updateData, refersh } = props;
	const [key, setKey] = useState('');

	const graphinRef = useRef<HTMLDivElement>();

	return (
		<div ref={graphinRef} className={styles['graphin-box']}>
			<Graphin
				key={key}
				data={data}
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
	const graphinRef = useRef<GraphinRef>();
	// 传入数据 根据此数据获取图谱数据
	const originData = location.state;
	//是否命中数据
	const [isHit, setHit] = useState<boolean>(false);
	//是否有表
	const [hasList, setHasList] = useState<boolean>(false);
	// 图谱数据
	const [data, setDate] = useState<GraphinData>();
	//列表数据
	const [tableData, setTableData] = useState([]);
	//传给后端的数据
	const [submitData, setSubmitData] = useState([]);
	//表格colums设置
	const [colums, setColums] = useState([]);
	//表头
	const [tableHead, setTableHead] = useState([]);
	//保存图谱
	const [open, setSaveOpen] = React.useState(false);
	//保存文件
	const [fileUrl, setFile] = React.useState();
	//保存默认名称
	const defaultName = originData.name;

	useEffect(() => {
		getGraphinData();
	}, []);

	// 根据表数据动态渲染表
	useEffect(() => {
		if (tableData && tableData.length > 0) {
			console.log(tableData, 191191);
			// 根据数据获取对应项
			const arr = Object.keys(tableData[0]);
			const colums = tableHead.map((item, index) => {
				return {
					title: item,
					dataIndex: arr[index],
					ellipsis: true
				};
			});
			setColums(colums);
		}
	}, [tableData]);

	//
	const transToTableData = (head: [], data: []) => {
		const tableDataArr = [];
		data.forEach((item) => {
			let newObj = {};
			item.forEach((el, i) => {
				newObj[head[i]] = el;
			});
			tableDataArr.push(newObj);
		});
		return tableDataArr;
	};

	// 获取图谱数据
	const getGraphinData = async () => {
		// const res = await getGraphByRule({
		// 	ruleId: originData.ruleId,
		// 	value: originData.value
		// });
		// console.log(res, 211211211);

		// 模拟数据;
		const res = {
			isHit: true,
			hasList: true,
			data: [
				['张三', '12'],
				['李四', '22']
			],
			head: ['姓名', '年龄'],
			nodes: [
				{
					id: 'node-0',
					x: 100,
					y: 100,
					data: {
						type: 'centerPointer'
					},
					style: {
						label: {
							value: '我是\nnode0',
							position: 'center',
							offset: [0, 0],
							fill: 'green'
						},
						keyshape: {
							size: 80,
							stroke: '#ff9f0f',
							fill: '#ff9f0ea6'
						}
					}
				},
				{
					id: 'node-1',
					x: 200,
					y: 200,
					data: {
						type: 'project'
					},
					style: {
						label: {
							value: '我是node1',
							position: 'center',
							offset: [0, 5],
							fill: 'green'
						},
						keyshape: {
							size: 60,
							stroke: '#ff9f0f',
							fill: '#ff9f0ea6'
						}
					}
				},
				{
					id: 'node-2',
					x: 100,
					y: 300,
					data: {
						type: 'project'
					},
					style: {
						label: {
							value: '我是node2',
							position: 'center',
							offset: [20, 5],
							fill: 'green'
						},
						keyshape: {
							size: 40,
							stroke: '#ff9f0f',
							fill: '#ff9f0ea6'
						}
					}
				},
				{
					id: 'node-3',
					data: {
						type: 'person'
					},
					style: {
						label: {
							value: '我是node3',
							position: 'center',
							offset: [20, 5],
							fill: 'green'
						},
						keyshape: {
							size: 40,
							stroke: '#ff9f0f',
							fill: '#ff9f0ea6'
						}
					}
				},
				{
					id: 'node-4',
					data: {
						type: 'person'
					},
					style: {
						label: {
							value: '我是node4',
							position: 'center',
							offset: [20, 0],
							fill: 'green'
						},
						keyshape: {
							size: 40,
							stroke: '#ff9f0f',
							fill: '#ff9f0ea6'
						}
					}
				}
			],
			edges: [
				{
					id: 'edge-0-1',
					source: 'node-0',
					target: 'node-1',
					style: {
						label: {
							value: '我是边1'
						}
					}
				},
				{
					id: 'edge-0-3',
					source: 'node-0',
					target: 'node-3',
					style: {
						label: {
							value: '我是边4'
						}
					}
				},
				{
					id: 'edge-3-4',
					source: 'node-3',
					target: 'node-4',
					style: {
						label: {
							value: '我是边5'
						}
					}
				},
				{
					id: 'edge-1-2',
					source: 'node-1',
					target: 'node-2',
					style: {
						label: {
							value: '我是边2'
						},
						keyshape: {
							lineWidth: 5,
							stroke: '#00f'
						}
					}
				},
				{
					id: 'edge-0-2',
					source: 'node-0',
					target: 'node-2',
					style: {
						label: {
							value: '我是边3'
						}
					}
				}
			]
		};

		//是否命中数据
		setHit(res.isHit);
		//是否有表
		setHasList(res.hasList);

		if (res.hasList) {
			//表头
			setTableHead(res.head);

			//将后端数据转换成渲染表的数据
			setTableData(transToTableData(res.head, res.data));

			// 传入后台的数据
			setSubmitData(res?.data);
		}
		// 图谱数据
		const graphData = {
			edges: res.edges,
			nodes: res.nodes
		};
		setDate(graphData);

		// 模拟数据
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

	//返回
	const goBack = () => {
		navigate(-1);
	};

	return (
		<div className={styles['rule-result-page']}>
			<div className={styles['top-tips']}>
				<span className={styles['rule-name']}>规则名称:{originData.name}</span>
				<span style={{ marginRight: '10px' }} onClick={() => goBack()}>
					<SvgIcon
						name="close"
						color="#23955C"
						className={styles['icon-close']}
					></SvgIcon>
				</span>
			</div>
			<>
				{isHit ? (
					<div className={styles['main-content']}>
						{hasList ? (
							<div className={styles['table-box']}>
								<Table
									className={styles['my-table']}
									columns={colums}
									dataSource={tableData}
									pagination={false}
								></Table>
							</div>
						) : null}
						<div className={styles['graphin-box']}>
							{data && (
								<>
									<div className={styles['graphin-box__com']}>
										<GraphinCom data={data}></GraphinCom>
									</div>
									<div className={styles['graphin-box__btn']}>
										<Button
											htmlType="button"
											className={styles['save-button']}
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
							head={tableHead}
							ruleId={originData.ruleId}
							ruleName={originData.name}
							fileUrl={fileUrl}
							setSaveOpen={setSaveOpen}
							orData={submitData}
						></SaveCom>
					</div>
				) : null}
			</>
		</div>
	);
};

export default GraphCom;
