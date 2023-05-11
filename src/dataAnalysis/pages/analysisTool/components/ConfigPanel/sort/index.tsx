import React, { FC, useState, useEffect } from 'react';
import classes from './index.module.less';
import { Button, Form, Collapse } from 'antd';
import { UpIcon, Downicon, HeartIcon, DelIcon } from './icon';
import { DownOutlined } from '@ant-design/icons';
const { Panel } = Collapse;

interface SortProps {
	option?: List[];
	value?: string[];
	onChange?: (value: string[]) => void;
}

interface List {
	title: string;
	list: {
		title: string;
		isUp: boolean;
		isDown: boolean;
	}[];
}

const layout = {
	labelCol: { span: 0 },
	wrapperCol: { span: 24 },
	labelAlign: 'left'
};

const tailLayout = {
	wrapperCol: { offset: 24, span: 0 }
};

const SortInput: FC<SortProps> = ({ option = [], value, onChange }) => {
	const [optionList, setOptionList] = useState<List[]>(
		JSON.parse(JSON.stringify(option))
	);
	const [activeKey, setActiveKey] = useState<string>(''); //控制表单开关
	//通过传入的状态值和下标修改dataList的排序状态
	const setSortStatus = (
		data: { isUp: boolean; isDown: boolean },
		index: number,
		childrenIndex: number
	) => {
		const newDataList = JSON.parse(JSON.stringify(optionList));
		newDataList[index].list[childrenIndex].isUp = data.isUp;
		newDataList[index].list[childrenIndex].isDown = data.isDown;
		setOptionList(newDataList);
	};
	//监听optionList改变触发onChange
	useEffect(() => {
		let newData: string[] = [];
		optionList.forEach((res) => {
			res.list.forEach((ress) => {
				if (ress.isDown || ress.isUp) {
					newData.push(ress.title);
				}
			});
		});
		onChange?.(newData);
	}, [optionList]);
	return (
		<Collapse
			collapsible="icon"
			activeKey={activeKey}
			className={classes.wrapBoxCollapse}
			ghost
			expandIcon={() => <div></div>}
		>
			<Panel
				header={
					<div className={classes.inputWrap}>
						<div>排序</div>
						<div className={classes.rightInput}>
							<div className={classes.left}>
								{optionList.map((item, index) => {
									return item.list.map((items, childrenIndex) => {
										return (
											(items.isUp || items.isDown) && (
												<div className={classes.label} key={items.title}>
													{items.title}
													<div style={{ marginLeft: '6px' }}>
														{items.isUp && <UpIcon />}
														{items.isDown && <Downicon />}
													</div>
													<DelIcon
														onClick={() => {
															setSortStatus(
																{ isUp: false, isDown: false },
																index,
																childrenIndex
															);
														}}
														className={classes.delIcon}
													></DelIcon>
												</div>
											)
										);
									});
								})}
							</div>
							<DownOutlined
								onClick={() => {
									if (activeKey) {
										setActiveKey('');
									} else {
										setActiveKey('1');
									}
								}}
								className={classes.downOutlined}
							/>
						</div>
					</div>
				}
				key="1"
			>
				<Collapse
					className={classes.boxCollapse}
					defaultActiveKey={['1']}
					ghost
					expandIcon={({ isActive }) => (
						<HeartIcon
							style={{
								transform: isActive ? 'rotate(0deg)' : 'rotate(-90deg)',
								transition: 'all linear .25s'
							}}
						/>
					)}
				>
					{optionList.map((item, index) => {
						return (
							<Panel header={item.title} key={index + 1}>
								{item.list.map((items, childrenIndex) => {
									return (
										<div key={items.title} className={classes.sortTxt}>
											<span>{items.title}</span>
											<div className={classes.sortWrap}>
												<div
													style={{ marginRight: '10px' }}
													onClick={() => {
														setSortStatus(
															{ isUp: !items.isUp, isDown: false },
															index,
															childrenIndex
														);
													}}
													className={`${classes.sortBtn} ${
														items.isUp && classes.activeBtn
													}`}
												>
													升 <UpIcon />
												</div>
												<div
													onClick={() => {
														setSortStatus(
															{ isUp: false, isDown: !items.isDown },
															index,
															childrenIndex
														);
													}}
													className={`${classes.sortBtn} ${
														items.isDown && classes.activeBtn
													}`}
												>
													降 <Downicon />
												</div>
											</div>
										</div>
									);
								})}
							</Panel>
						);
					})}
				</Collapse>
			</Panel>
		</Collapse>
	);
};

const Sort: FC = () => {
	const [form] = Form.useForm();
	const [dataList, setDataList] = useState<List[]>([
		{
			title: '数据表1',
			list: [
				{ title: '字段1文字', isUp: false, isDown: false },
				{ title: '字段2文字很长很长', isUp: false, isDown: false },
				{ title: '字段3文字很长很长', isUp: false, isDown: false }
			]
		},
		{
			title: '数据表2',
			list: [
				{ title: '字段01文字很长很长', isUp: false, isDown: false },
				{ title: '字段02文字', isUp: false, isDown: false }
			]
		}
	]);

	const onFinish = (values: any) => {
		console.log(values);
	};

	const onReset = () => {
		form.resetFields();
	};

	return (
		<Form
			{...layout}
			form={form}
			name="control"
			onFinish={onFinish}
			className={classes.fromWrap}
			initialValues={{
				according: ['字段1文字', '字段01文字很长很长']
			}}
		>
			<div className={classes.formList}>
				<Form.Item name="according" label="">
					<SortInput option={dataList}></SortInput>
				</Form.Item>
			</div>

			<Form.Item {...tailLayout}>
				<div style={{ justifyContent: 'end', display: 'flex', width: '100%' }}>
					<Button
						className={`${classes.btn} ${classes.reset}`}
						htmlType="button"
						onClick={onReset}
					>
						重置
					</Button>
					<Button
						className={`${classes.btn} ${classes.submit}`}
						type="primary"
						htmlType="submit"
					>
						执行
					</Button>
				</div>
			</Form.Item>
		</Form>
	);
};

export default Sort;
