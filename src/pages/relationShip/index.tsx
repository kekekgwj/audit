import React, { useEffect } from 'react';
import { Button } from 'antd';
import { type GraphinData } from '@antv/graphin';
import GraphinCom from '../../components/graphin';
import SideBar from '../../components/sidebar/sideBar';
import styles from './index.module.less';
import html2canvas from 'html2canvas';

const mockData: GraphinData = {
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

// **base64转图片文件方法**
const toImgStyle = (base64Str, fileName) => {
	let arr = base64Str.split(','),
		mime = arr[0].match(/:(.*?);/)[1], //base64解析出来的图片类型
		bstr = atob(arr[1]), //对base64串进行操作，去掉url头，并转换为byte   atob为window内置方法
		len = bstr.length,
		u8arr = new Uint8Array(len); //
	while (len--) {
		u8arr[len] = bstr.charCodeAt(len);
	}
	// 创建新的 File 对象实例[utf-8内容，文件名称或者路径，[可选参数，type：文件中的内容mime类型]]
	return new File([u8arr], fileName, {
		type: mime
	});
};

const RelationShipCom = () => {
	// 数据来源
	const [data, setDate] = React.useState(mockData);
	// 更新数据
	const updateData = (value: GraphinData) => {
		console.log(value, 107777);
		setDate(value);
	};

	// 保存图谱
	const saveGraph = () => {
		console.log('1111');
		window.pageYOffset = 0; //网页位置
		document.documentElement.scrollTop = 0; //滚动条的位置
		document.body.scrollTop = 0; //网页被卷去的高
		//获取要生成图片的dom区域并转为canvas;
		html2canvas(document.querySelector('#graphin-container')).then((canvas) => {
			let base64Img = canvas.toDataURL('image/png'); //将canvas转为base64
			// console.log(base64Img, 191111111);
			// // 下载到本地
			// const a = document.createElement('a');
			// a.href = base64Img;
			// a.download = true;
			// document.body.append(a);
			// a.click();
			let file = toImgStyle(base64Img, Date.now() + '.png');
			console.log(file, 2122222);
			//调用后端接口，将文件传给后端
		});
	};

	return (
		<div className={styles['main-content']}>
			<div className={styles['filter-bar']}>
				<SideBar updateData={updateData}></SideBar>
			</div>
			<div className={styles['graphin-box']}>
				<div className={styles['graphin-box__com']}>
					<GraphinCom
						data={data}
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
			</div>
		</div>
	);
};

export default RelationShipCom;
