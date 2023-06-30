import { Button, Form, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import classes from './index.module.less';
import { useConfigContextValue } from '../../NodeDetailPanel';
import { useGraphContext, useGraphPageInfo } from '../../../lib/hooks';
interface ISelectRowProps {
	value?: any;
	onChange?: any;
	handleOnDelete: (key: number) => void;
	rowName: number;
	leftOptions: [];
	rightOptions: [];
}
interface IRowCondition {
	leftHeaderName: string;
	leftTableName: string;
	operator: string;
	rightHeaderName: string;
	rightTableName: string;
}
interface IExecuteConfig {
	connectionSentences: IRowCondition[];
	connectionType: string;
	leftTableName: string;
	rightTableName: string;
}
type IForm = Pick<IExecuteConfig, 'connectionSentences' | 'connectionType'>;
const AddIcon = (
	<svg
		version="1.1"
		id="Layer_1"
		xmlns="http://www.w3.org/2000/svg"
		x="0px"
		y="0px"
		width="19px"
		height="19px"
		viewBox="0 0 19 19"
		enable-background="new 0 0 19 19"
	>
		{' '}
		<image
			id="image0"
			width="19"
			height="19"
			x="0"
			y="0"
			href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAMAAABFjsb+AAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAclBMVEUAAAAkoG0kom8ko24k
o24jom8jpG8gn3Agn2Ajo28ko28jo24iom8gn3Ajo24jom4hpm8ko24jom8amWYko28ko24jpG4k
o28jom4jnGojpHAko28jo28kom8jom8jo2ojpG8jom8ko28gn2oko2////+t/cqDAAAAJHRSTlMA
I4fH8++DIAiT64s8EOeXF9OfFM9/l+/nJDvH7++DJJ+X0xisDZkjAAAAAWJLR0QlwwHJDwAAAAd0
SU1FB+cFEgc6I3fkKHAAAACjSURBVBjTZVDbFoIgEJwAL9xKAcss7/z/N5agddR5WWZ2lj07wIIL
ocwnNM2wIedCKg2t5PWWR6kojV671rgiuFyFP6pycd5NZI9YDAey2kbiY9HiiVRip0ES0OagqRfe
+qBpFp6t39CGJjv5ElB1/o+c9nbohd5ptv4GwYdI2vWOcbl32t3rQjKzG+y200zzmt9YyybkJ3j+
m8g6mnhGSR/YB8fyCcufudUZAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIzLTA1LTE4VDA3OjU4OjM1
KzAwOjAwPJ/QrgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMy0wNS0xOFQwNzo1ODozNSswMDowME3C
aBIAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjMtMDUtMThUMDc6NTg6MzUrMDA6MDAa10nNAAAA
AElFTkSuQmCC"
		/>
	</svg>
);
const DeleteIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		version="1.1"
		id="Layer_1"
		x="0px"
		y="0px"
		width="19px"
		height="19px"
		viewBox="0 0 19 19"
		enable-background="new 0 0 19 19"
	>
		{' '}
		<image
			id="image0"
			width="19"
			height="19"
			x="0"
			y="0"
			href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAMAAABFjsb+AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAY1BMVEUAAAD/g4P/hoL/hYP/ hYL/hYL/hoL/gID/gID/hoL/hYL/hoL/hID/gID/hoL/hYL/hYX/hoP/hYT/gID/hYL/hYP/hoP/ h4P/gID/hoL/h4P/hYP/hYP/hYT/gID/hoP///9leLm4AAAAH3RSTlMAI4fH8++DIAiT64s8EOeX F9OfFJ/Pz38kO8fz75cYUOzG8gAAAAFiS0dEILNrPYAAAAAHdElNRQfnBRIIBhMpkiYeAAAAnElE QVQY02WQ2RaDIBBDUxCUZVAUty7y/39ZpdoWvS+cCRk4CbBxY7yIgssSB5XSxhLIGldXH6nxLe23 Xeib5BpG/Bj95qxb/BMUULou00hPkAY5hoHPJ83eIeik0QNxPUQ8eK5TRHHxCXB7fY9d/pWYdL7c ubUIFfIcry2vz/IOqZmlD0c8Cn7Z+6udmVN/WlXfjVJyEQvOpjS9AViFB3FS1CVDAAAAJXRFWHRk YXRlOmNyZWF0ZQAyMDIzLTA1LTE4VDA4OjA2OjE4KzAwOjAwV4P/1wAAACV0RVh0ZGF0ZTptb2Rp ZnkAMjAyMy0wNS0xOFQwODowNjoxOCswMDowMCbeR2sAAAAodEVYdGRhdGU6dGltZXN0YW1wADIw MjMtMDUtMThUMDg6MDY6MTkrMDA6MDDXvG0AAAAAAElFTkSuQmCC"
		/>
	</svg>
);

const SelectRow: React.FC<ISelectRowProps> = ({
	value = { left: '', right: '', symbol: '' },
	handleOnDelete,
	rowName,
	leftOptions,
	rightOptions
}) => {
	if (!value || value.length < 3) {
		return null;
	}

	const symbolSelect = [
		{
			label: '=',
			value: '1'
		},
		{
			label: '>',
			value: '2'
		},
		{
			label: '<',
			value: '4'
		},
		{
			label: '>=',
			value: '3'
		},
		{
			label: '<=',
			value: '5'
		},
		{
			label: '!=',
			value: '6'
		}
	];

	return (
		<div className={classes.filterGroupWrapper}>
			<Form.Item name={[rowName, 'leftHeaderName']} noStyle>
				<Select options={leftOptions} style={{ width: 120 }}></Select>
			</Form.Item>
			<Form.Item name={[rowName, 'operator']} noStyle>
				<Select options={symbolSelect} style={{ width: 120 }}></Select>
			</Form.Item>
			<Form.Item name={[rowName, 'rightHeaderName']} noStyle>
				<Select options={rightOptions} style={{ width: 120 }}></Select>
			</Form.Item>

			{/* <div
				className={classes.deleteRow}
				onClick={() => handleOnDelete(rowName)}
			>
				{DeleteIcon}
				<span>删除</span>
			</div> */}
			<Button
				onClick={() => handleOnDelete(rowName)}
				type="text"
				shape="round"
				icon={DeleteIcon}
				className={classes.deleteRow}
			>
				删除
			</Button>
		</div>
	);
};

const SelectGroup: React.FC = () => {
	const [form] = Form.useForm();
	const { id, setValue, resetValue, executeByNodeConfig, config, initValue } =
		useConfigContextValue();
	const [showTips, setShowTips] = useState<boolean>(false);
	const { isPublicTemplate } = useGraphContext();
	const [leftOptions, setLeftSelect] = useState([]);
	const [rightOptions, setRightSelect] = useState([]);

	const handleGetNodeConfig = () => {
		const configData1 = config[0] || [];
		const configData2 = config[1] || [];
		// 获取下拉选项
		const leftData = configData1?.fields?.map((item, index) => {
			return {
				label: item.description || item.fieldName, //展示描述没有展示名称
				value: item.fieldName
			};
		});
		const rightData = configData2?.fields?.map((item, index) => {
			return {
				label: item.description || item.fieldName, //展示描述没有展示名称
				value: item.fieldName
			};
		});
		setLeftSelect(leftData);
		setRightSelect(rightData);
	};

	useEffect(() => {
		handleGetNodeConfig();
	}, []);

	const handleOnclickAdd = () => {
		const list = form.getFieldValue('connectionSentences') || [];
		const nextList = list.concat({
			key: list.length,
			fieldKey: list.length,
			operator: '1'
		});
		if (nextList.length > 0) {
			setShowTips(true);
		} else {
			setShowTips(false);
		}

		form.setFieldsValue({
			connectionSentences: nextList
		});
	};
	const formatSubmitValue = (value: IForm): IExecuteConfig | [] => {
		const [leftTableName, rightTableName] = config
			? config?.map((item) => item.tableName)
			: [null, null];
		const { connectionSentences, connectionType } = value;
		if (connectionSentences && connectionSentences.length) {
			const formatValue = value.connectionSentences.map((item, index) => {
				return {
					leftTableName,
					rightTableName,
					leftHeaderName: item.leftHeaderName,
					operator: item.operator,
					rightHeaderName: item.rightHeaderName
				};
			});
			return {
				connectionSentences: formatValue,
				leftTableName: leftTableName,
				rightTableName: rightTableName,
				connectionType
			};
		}
		return [];
	};
	const onFinish = () => {
		executeByNodeConfig();
	};
	const handleOnDelete = (key: number) => {
		const list = form.getFieldValue('connectionSentences') || [];
		if (list.length === 0) {
			return;
		}
		const nextList = list.slice();
		if (nextList.length > 1) {
			setShowTips(true);
		} else {
			setShowTips(false);
		}
		nextList.splice(key, 1);
		form.setFieldsValue({
			connectionSentences: nextList
		});
		// 删除不会触发onValueChange 手动触发
		const formValues = form.getFieldsValue();
		handleOnChange(formValues);
	};
	const handleOnChange = (value: IForm) => {
		if (!id || !setValue) {
			return;
		}

		setValue(formatSubmitValue(value));
	};
	const handleReset = () => {
		form.resetFields();
		id && resetValue();
	};

	useEffect(() => {
		const connectionSentences = [];

		if (isEmpty(initValue.connectionSentences)) {
			if (!isEmpty(config[0].recommendFieldNames)) {
				config[0].recommendFieldNames.forEach((item, index) => {
					connectionSentences.push({
						key: index,
						fieldKey: index,
						leftHeaderName: item,
						leftTableName: config[0].tableName,
						operator: '=',
						rightHeaderName: config[1].recommendFieldNames[index],
						rightTableName: config[1].tableName
					});
				});
			}
		}

		form.setFieldsValue({
			connectionSentences,
			connectionType: 'INNER JOIN',
			...initValue
		});
	}, []);

	return (
		<div style={{ overflowY: 'auto', paddingRight: '20px', height: '300px' }}>
			<Form
				name="customized_form_controls"
				layout="vertical"
				onFinish={onFinish}
				onValuesChange={(_, value) => {
					handleOnChange(value);
				}}
				// initialValues={{
				// 	connectionSentences: [],
				// 	connectionType: 'INNER JOIN',
				// 	...initValue
				// }}
				form={form}
				disabled={isPublicTemplate}
			>
				<div style={{ fontSize: '14px', marginBottom: 20 }}>
					<span style={{ fontWeight: 'bold' }}>连接语句: </span>
					<span>多行之间是"且"的关系</span>
				</div>

				<Form.List name="connectionSentences">
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name }) => (
								<Form.Item name={name} key={key}>
									<SelectRow
										key={key}
										rowName={name}
										handleOnDelete={handleOnDelete}
										leftOptions={leftOptions}
										rightOptions={rightOptions}
									></SelectRow>
								</Form.Item>
							))}
						</>
					)}
				</Form.List>
				<Button
					className={classes.addConnectBtn}
					onClick={() => {
						handleOnclickAdd();
					}}
					disabled={isPublicTemplate}
				>
					{AddIcon}
					<span style={{ marginLeft: '-10px' }}>添加连接语句</span>
				</Button>
				<div className={classes.addRow}>
					<span
						style={{ fontSize: 14, fontWeight: 'bold', marginBottom: '24px' }}
					>
						连接类型
					</span>
					<Form.Item name={'connectionType'}>
						<Select style={{ width: 395, marginLeft: 0 }}>
							<Select.Option value="INNER JOIN">内连接</Select.Option>
							<Select.Option value="LEFT JOIN">左连接</Select.Option>
							<Select.Option value="RIGHT JOIN">右连接</Select.Option>
						</Select>
					</Form.Item>
				</div>
				<div className={classes.controlRow}>
					<Button
						className={`${classes.btn} ${classes.reset}`}
						htmlType="button"
						onClick={() => handleReset()}
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
			</Form>
		</div>
	);
};
export default SelectGroup;
