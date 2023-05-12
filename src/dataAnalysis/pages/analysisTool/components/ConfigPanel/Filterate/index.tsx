import { useState } from 'react';
import { Button, Checkbox, Form, Input, Select } from 'antd';
import SvgIcon from '@/components/svg-icon';
import styles from './index.module.less';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

const CheckboxGroup = Checkbox.Group;

// 生成hash
const getHash = () => {
	const s = [];
	const hexDigits = '0123456789abcdef';
	for (let i = 0; i < 36; i++) {
		s[i] = hexDigits.substring(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substring((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = '-';

	const uuid = s.join('');
	return uuid;
};

type RowGroupItme = {
	_key: string;
	value1: string;
	value2: string;
	value3: string;
};

type FormData = {
	row: Array<Array<RowGroupItme>>;
	col: Array<CheckboxValueType>;
};

const data: FormData = {
	row: [
		[
			{
				_key: getHash(),
				value1: '',
				value2: '',
				value3: ''
			}
		]
	],

	col: []
};

type setRowData = (
	rowGroupIndex: number,
	itemIndex: number,
	data: RowGroupItme
) => void;

type delGroup = (rowGroupIndex: number) => void;
type delRow = (rowGroupIndex: number, rowIndex: number) => void;
type addRow = (rowGroupIndex: number, rowIndex: number) => void;

interface GroupProps {
	index: number;
	rowGroup: Array<RowGroupItme>;
	setRowData: setRowData;
	delGroup: delGroup;
	delRow: delRow;
	addRow: addRow;
}

interface RowProps {
	groupIndex: number;
	index: number;
	defaultValue: RowGroupItme;
	setRowData: setRowData;
	delRow: delRow;
	addRow: addRow;
}

const Group = (props: GroupProps) => {
	const handleDelGroup = () => {
		console.log('ddd');
		props.delGroup(props.index);
	};

	const delRow = (groupIndex: number, rowIndex: number) => {
		if (props.rowGroup.length === 1) {
			props.delGroup(groupIndex);
			return;
		}

		props.delRow(groupIndex, rowIndex);
	};

	return (
		<div className={styles['filter-box__rowgroup']}>
			<div className={styles['filter-box__rows']}>
				{props.rowGroup.map((item, itemIndex) => {
					return (
						<Row
							key={item._key}
							groupIndex={props.index}
							index={itemIndex}
							defaultValue={item}
							setRowData={props.setRowData}
							delRow={delRow}
							addRow={props.addRow}
						></Row>
					);
				})}
			</div>
			<div className={styles['delete-group']} onClick={handleDelGroup}>
				<SvgIcon name="delete" color="#24A36F"></SvgIcon>
			</div>
		</div>
	);
};

const Row = (props: RowProps) => {
	const handleChange = (key: string, val: string) => {
		props.setRowData(props.groupIndex, props.index, {
			...props.defaultValue,
			[key]: val
		});
	};

	const handleDel = () => {
		props.delRow(props.groupIndex, props.index);
	};

	const handleAdd = () => {
		props.addRow(props.groupIndex, props.index);
	};

	return (
		<div className={styles['filter-box__row']}>
			<Select
				className={styles['filter-box__row_item']}
				defaultValue={props.defaultValue.value1}
				placeholder="请选择"
				options={[
					{ value: 'jack', label: 'Jack' },
					{ value: 'lucy', label: 'Lucy' },
					{ value: 'Yiminghe', label: 'yiminghe' },
					{ value: 'disabled', label: 'Disabled', disabled: true }
				]}
				onChange={(value) => handleChange('value1', value)}
			/>
			<Select
				className={styles['filter-box__row_item']}
				defaultValue={props.defaultValue.value2}
				placeholder="请选择"
				options={[
					{ value: 'jack', label: 'Jack' },
					{ value: 'lucy', label: 'Lucy' },
					{ value: 'Yiminghe', label: 'yiminghe' },
					{ value: 'disabled', label: 'Disabled', disabled: true }
				]}
				onChange={(value) => handleChange('value2', value)}
			/>
			<Input className={styles['filter-box__row_item']} placeholder="请输入" />
			<div className={styles['filter-box__row_btns']}>
				<div className={styles['add-row']} onClick={handleAdd}>
					<SvgIcon name="add-circle" color="#24A36F"></SvgIcon>
				</div>
				<div className={styles['del-row']} onClick={handleDel}>
					<SvgIcon name="del-circle" color="#FF8683"></SvgIcon>
				</div>
			</div>
		</div>
	);
};

export default () => {
	const [formData, setFormData] = useState(data);
	const [indeterminate, setIndeterminate] = useState(false);
	const [checkAll, setCheckAll] = useState(false);

	const plainOptions = ['Apple', 'Pear', 'Orange'];

	const handleClick = () => {
		console.log('form', formData);
	};

	// 更新表单值
	const setRowData = (
		groupIndex: number,
		rowIndex: number,
		data: RowGroupItme
	) => {
		formData.row[groupIndex][rowIndex] = data;
		setFormData({
			...formData
		});
	};

	// 删除组
	const delGroup = (rowGroup: number) => {
		formData.row.splice(rowGroup, 1);
		setFormData({
			...formData
		});
	};

	// 增加组
	const addGroup = () => {
		formData.row.push([
			{
				_key: getHash(),
				value1: '',
				value2: '',
				value3: ''
			}
		]);

		setFormData({
			...formData
		});
	};

	// 删除行
	const delRow = (groupIndex: number, rowIndex: number) => {
		formData.row[groupIndex].splice(rowIndex, 1);
		setFormData({
			...formData
		});
	};

	// 新增行
	const addRow = (groupIndex: number, rowIndex: number) => {
		formData.row[groupIndex].splice(rowIndex + 1, 0, {
			_key: getHash(),
			value1: '',
			value2: '',
			value3: ''
		});

		setFormData({
			...formData
		});
	};

	const onCheckAllChange = (e: CheckboxChangeEvent) => {
		formData.col = e.target.checked ? plainOptions : [];
		setFormData({
			...formData
		});
		setIndeterminate(false);
		setCheckAll(e.target.checked);
	};

	const onChange = (list: CheckboxValueType[]) => {
		formData.col = list;
		setFormData({
			...formData
		});
		setIndeterminate(!!list.length && list.length < plainOptions.length);
		setCheckAll(list.length === plainOptions.length);
	};

	return (
		<>
			<div className={styles['filter-box']}>
				<div className={styles['filter-box__title']}>
					<div className={styles['label']}>行筛选</div>
					<div>同一组内为且，不同组间为或</div>
				</div>

				{formData.row.map((rowGroup, rowGroupIndex) => {
					return (
						<Group
							key={rowGroupIndex}
							index={rowGroupIndex}
							rowGroup={rowGroup}
							setRowData={setRowData}
							delGroup={delGroup}
							addRow={addRow}
							delRow={delRow}
						></Group>
					);
				})}
				<div className={styles['add-group']} onClick={addGroup}>
					<SvgIcon
						name="add-circle"
						className={styles['add-group__icon']}
					></SvgIcon>
					<span>添加行筛选</span>
				</div>
			</div>

			<div className={styles['filter-box']}>
				<div className={styles['filter-box__title']}>
					<div className={styles['label']}>列筛选</div>
					<div>
						<Checkbox
							indeterminate={indeterminate}
							onChange={onCheckAllChange}
							checked={checkAll}
						>
							全选
						</Checkbox>
					</div>
				</div>

				<CheckboxGroup
					options={plainOptions}
					value={formData.col}
					onChange={onChange}
				/>
			</div>
		</>
	);
};
