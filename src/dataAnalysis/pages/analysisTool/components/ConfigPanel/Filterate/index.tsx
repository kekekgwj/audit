import { createContext, useContext, useReducer, useState } from 'react';
import { Button, Checkbox, Form, Input, Select } from 'antd';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import SvgIcon from '@/components/svg-icon';
import styles from './index.module.less';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useConfigContextValue } from '../../NodeDetailPanel';

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
}

interface RowProps {
	groupIndex: number;
	index: number;
	defaultValue: RowGroupItme;
	delRow: delRow;
}

interface FilterateContext {
	setRowData: setRowData;
	delGroup: delGroup;
	delRow: delRow;
	addRow: addRow;
}

const CheckboxGroup = Checkbox.Group;
const FilterateContext = createContext<FilterateContext | null>(null);

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

const Group = (props: GroupProps) => {
	const filterateContext = useContext(FilterateContext);
	const handleDelGroup = () => {
		filterateContext?.delGroup(props.index);
	};

	const delRow = (groupIndex: number, rowIndex: number) => {
		if (props.rowGroup.length === 1) {
			filterateContext?.delGroup(groupIndex);
			return;
		}

		filterateContext?.delRow(groupIndex, rowIndex);
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
							delRow={delRow}
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
	const filterateContext = useContext(FilterateContext);

	const handleChange = (key: string, val: string) => {
		filterateContext?.setRowData(props.groupIndex, props.index, {
			...props.defaultValue,
			[key]: val
		});
	};

	const handleDel = () => {
		props.delRow(props.groupIndex, props.index);
	};

	const handleAdd = () => {
		filterateContext?.addRow(props.groupIndex, props.index);
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
			<Input
				defaultValue={props.defaultValue.value3}
				className={styles['filter-box__row_item']}
				placeholder="请输入"
				onChange={(e) => handleChange('value3', e.target.value)}
			/>
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

const reducer = (state: FormData, action: any) => {
	switch (action.type) {
		case 'setRowData':
			state.row[action.groupIndex][action.rowIndex] = action.data;
			break;
		case 'delGroup':
			state.row.splice(action.groupIndex, 1);
			break;
		case 'addGroup':
			state.row.push([
				{
					_key: getHash(),
					value1: '',
					value2: '',
					value3: ''
				}
			]);
			break;
		case 'addRow':
			state.row[action.groupIndex].splice(action.rowIndex + 1, 0, {
				_key: getHash(),
				value1: '',
				value2: '',
				value3: ''
			});
			break;
		case 'delRow':
			state.row[action.groupIndex].splice(action.rowIndex, 1);
			break;

		case 'setCol':
			state.col = action.data;
			break;
		case 'reset':
			state = {
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
			break;
		default:
			break;
	}

	return { ...state };
};

export default () => {
	const { id, getValue, setValue, resetValue } = useConfigContextValue();
	let initData = getValue && id && getValue(id);
	if (isEmpty(getValue && id && getValue(id))) {
		initData = cloneDeep(data);
	}
	const [formData, dispatch] = useReducer(reducer, initData);
	// const [formData, setFormData] = useState(data);
	const [indeterminate, setIndeterminate] = useState(false);
	const [checkAll, setCheckAll] = useState(false);

	const plainOptions = ['Apple', 'Pear', 'Orange'];

	// 执行
	const submit = () => {
		// TODO
	};

	const set = () => {
		if (!id || !setValue) {
			return;
		}
		setValue(id, formData);
	};

	// 重置
	const reset = () => {
		if (!id || !setValue) {
			return;
		}
		resetValue(id);
		dispatch({ type: 'reset' });
	};

	// 更新表单值
	const setRowData = (
		groupIndex: number,
		rowIndex: number,
		data: RowGroupItme
	) => {
		dispatch({ type: 'setRowData', groupIndex, rowIndex, data });
		set();
	};

	// 删除组
	const delGroup = (groupIndex: number) => {
		dispatch({ type: 'delGroup', groupIndex });
	};

	// 增加组
	const addGroup = () => {
		dispatch({ type: 'addGroup' });
		set();
	};

	// 删除行
	const delRow = (groupIndex: number, rowIndex: number) => {
		dispatch({ type: 'delRow', groupIndex, rowIndex });
		set();
	};

	// 新增行
	const addRow = (groupIndex: number, rowIndex: number) => {
		dispatch({ type: 'addRow', groupIndex, rowIndex });
		set();
	};

	const onCheckAllChange = (e: CheckboxChangeEvent) => {
		dispatch({ type: 'setCol', data: e.target.checked ? plainOptions : [] });
		setIndeterminate(false);
		setCheckAll(e.target.checked);
		set();
	};

	const onChange = (list: CheckboxValueType[]) => {
		dispatch({ type: 'setCol', data: list });
		setIndeterminate(!!list.length && list.length < plainOptions.length);
		setCheckAll(list.length === plainOptions.length);
		set();
	};

	return (
		<>
			<FilterateContext.Provider
				value={{
					setRowData,
					delGroup,
					delRow,
					addRow
				}}
			>
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
				<div className={styles.controlRow}>
					<Button
						className={`${styles.btn} ${styles.reset}`}
						htmlType="button"
						onClick={reset}
					>
						重置
					</Button>
					<Button
						className={`${styles.btn} ${styles.submit}`}
						type="primary"
						htmlType="submit"
						onClick={submit}
					>
						执行
					</Button>
				</div>
			</FilterateContext.Provider>
		</>
	);
};
