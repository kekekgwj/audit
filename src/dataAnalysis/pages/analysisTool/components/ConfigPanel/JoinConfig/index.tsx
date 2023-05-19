import { Button, Form, Input, Select } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useMemo, useState } from 'react';
import Icon, { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import classes from './index.module.less';
import FormItem from 'antd/es/form/FormItem';

interface ISelectRowProps {
	value?: any;
	onChange?: any;
	handleOnclickAdd: () => void;
	handleOnDelete: (key: number) => void;
	key: number;
}
const AddIcon = (
	<svg
		version="1.1"
		id="Layer_1"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		x="0px"
		y="0px"
		width="19px"
		height="19px"
		viewBox="0 0 19 19"
		enable-background="new 0 0 19 19"
		xml:space="preserve"
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
		xmlns:xlink="http://www.w3.org/1999/xlink"
		version="1.1"
		id="Layer_1"
		x="0px"
		y="0px"
		width="19px"
		height="19px"
		viewBox="0 0 19 19"
		enable-background="new 0 0 19 19"
		xml:space="preserve"
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
	onChange,
	handleOnDelete,
	key,
	handleOnclickAdd
}) => {
	if (!value || value.length < 3) {
		return null;
	}

	const onLeftChange = (v: string) => {
		onChange({ ...value, left: v });
	};
	const onSymbolChange = (v: string) => {
		onChange({ ...value, symbol: v });
	};
	const onRightChange = (v: string) => {
		onChange({ ...value, right: v });
	};

	return (
		<div className={classes.filterGroupWrapper}>
			<Select
				options={options.leftSelect}
				value={value.left}
				style={{ width: 120 }}
				onChange={onLeftChange}
			></Select>
			<Select
				options={options.symbolSelect}
				value={value.symbol}
				style={{ width: 120 }}
				onChange={onSymbolChange}
			></Select>
			<Select
				options={options.rightSelect}
				value={value.right}
				style={{ width: 120 }}
				onChange={onRightChange}
			></Select>
			<div onClick={() => handleOnDelete(key)}>
				{DeleteIcon}
				<span>删除</span>
			</div>
		</div>
	);
};
const options = {
	leftSelect: [
		{
			label: 'id',
			value: 'id'
		}
	],
	rightSelect: [
		{
			label: 'id',
			value: 'id'
		}
	],
	symbolSelect: [
		{
			label: '+',
			value: '+'
		},
		{
			label: '-',
			value: '-'
		}
	]
};

const SelectGroup: React.FC = () => {
	const [form] = Form.useForm();

	const handleOnclickAdd = () => {
		const list = form.getFieldValue('configs') || [];
		const nextList = list.concat({
			key: list.length,
			fieldKey: list.length
		});
		form.setFieldsValue({
			configs: nextList
		});
	};
	const onFinish = (value: any) => {
		console.log(value);
	};
	const handleOnDelete = (key: number) => {
		const list = form.getFieldValue('configs') || [];
		if (list.length === 0) {
			return;
		}
		const nextList = list.slice();

		nextList.splice(key, 1);
		form.setFieldsValue({
			configs: nextList
		});
	};

	return (
		<div>
			<Form
				name="customized_form_controls"
				layout="vertical"
				onFinish={onFinish}
				initialValues={{
					configs: [{ key: 0, fieldKey: 0 }]
				}}
				form={form}
			>
				<div style={{ fontSize: '14px' }}>
					<span style={{ fontWeight: 'bold' }}>连接语句: </span>
					<span>多行之间是"且"的关系</span>
				</div>
				<Form.List name="configs">
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name }) => (
								<Form.Item name={name} key={key}>
									<SelectRow
										key={key}
										handleOnclickAdd={handleOnclickAdd}
										handleOnDelete={handleOnDelete}
									></SelectRow>
								</Form.Item>
							))}
						</>
					)}
				</Form.List>
				<div
					className={classes.addConnectBtn}
					onClick={() => {
						handleOnclickAdd();
					}}
				>
					{AddIcon}
					<span>添加连接语句</span>
				</div>
				<Form.Item name={'connect_type'} style={{ marginTop: 20 }}>
					<span style={{ fontSize: 14, fontWeight: 'bold' }}>连接类型</span>
					<Select style={{ width: 395, marginLeft: 18 }}>
						<Select.Option>内连接</Select.Option>
						<Select.Option>外连接</Select.Option>
					</Select>
				</Form.Item>
			</Form>
			<div style={{ justifyContent: 'end', display: 'flex', width: '100%' }}>
				<Button
					className={`${classes.btn} ${classes.reset}`}
					htmlType="button"
					onClick={() => form.resetFields()}
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
		</div>
	);
};
export default SelectGroup;
