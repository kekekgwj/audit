import React, { useEffect } from 'react';
import './algorithm.less';
import GraphinCom from '../relationShip/components/graphin';
import SideBar from './components/sideBar';

import { Button } from 'antd';

const mockData: GraphinData = {
	nodes: [
		{
			id: 'node-0',
			x: 100,
			y: 100,
			style: {
				label: {
					value: '我是node0',
					position: 'center',
					offset: [20, 5],
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
			style: {
				label: {
					value: '我是node1',
					position: 'center',
					offset: [20, 5],
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
			id: 'edge-2-0',
			source: 'node-2',
			target: 'node-0',
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
	// 更新数据
	const updateData = (value) => {
		setDate(value);
	};
	return (
		<div class="main-content">
			<div className="filter-bar">
				<SideBar updateData={updateData}></SideBar>
			</div>
			<div class="graphin-box">
				<div>
					<GraphinCom data={data}></GraphinCom>
				</div>
				<div class="save-box">
					<Button
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
