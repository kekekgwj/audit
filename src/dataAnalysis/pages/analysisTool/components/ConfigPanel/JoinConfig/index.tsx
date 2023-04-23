import { Button, Form, Input, Select } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useMemo, useState } from 'react';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import classes from './index.module.less';

const JoinConfig: React.FC = () => {
	return (
		<div>
			<div>
				<SelectGroup></SelectGroup>
			</div>
			<div>
				<Button>重置</Button>
				<Button>执行</Button>
			</div>
		</div>
	);
};
interface ISelectRowProps {
	value?: any;
	onChange?: any;
	handleOnclickAdd: () => void;
	handleOnDelete: (key: number) => void;
	key: number;
}
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
				onChange={onLeftChange}
			></Select>
			<Select
				options={options.symbolSelect}
				value={value.symbol}
				onChange={onSymbolChange}
			></Select>
			<Select
				options={options.rightSelect}
				value={value.right}
				onChange={onRightChange}
			></Select>
			<CloseOutlined onClick={() => handleOnDelete(key)} />
			<PlusOutlined onClick={() => handleOnclickAdd()} />
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
				layout="inline"
				onFinish={onFinish}
				initialValues={{
					configs: [{ key: 0, fieldKey: 0 }]
				}}
				form={form}
			>
				<Form.List name="configs">
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name }) => (
								<Form.Item name={name} label={`筛选项` + key} key={key}>
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
			</Form>
		</div>
	);
};
export default JoinConfig;
