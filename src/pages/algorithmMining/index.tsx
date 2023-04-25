import React, { useEffect } from 'react';
import { type GraphinData } from '@antv/graphin';
import GraphinCom from '../../components/graphin';
import SideBar from '../../components/sidebar/sideBar';
import { Button } from 'antd';
import html2canvas from 'html2canvas';
import styles from './index.module.less';
import { toImgStyle } from '@/utils/other';

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

const Algorithm = () => {
	// 数据来源
	const [data, setDate] = React.useState(mockData);
	const [barOpen, setBarOpen] = React.useState(true);
	// 更新数据
	const updateData = (value) => {
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
			const base64Img = canvas.toDataURL('image/png'); //将canvas转为base64
			const file = toImgStyle(base64Img, Date.now() + '.png');
			//调用后端接口，将文件传给后端
		});
	};

	const toggleBarLayout = (isOpen: boolean) => {
		setBarOpen(isOpen);
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
					canAdd={false}
				></SideBar>
			</div>
			<div className={styles['graphin-box']}>
				<div className={styles['graphin-box__com']}>
					<GraphinCom
						data={data}
						updateData={updateData}
						refersh={barOpen}
						onClose={() => {}}
					></GraphinCom>
				</div>
				<div className={styles['graphin-box__btn']}>
					<Button
						onClick={() => {
							saveGraph();
						}}
						htmlType="button"
						style={{ background: '#23955C', color: '#fff' }}
					>
						保存图谱
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Algorithm;
