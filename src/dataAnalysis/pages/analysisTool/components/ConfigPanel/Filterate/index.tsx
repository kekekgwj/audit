import {
	createContext,
	useContext,
	useEffect,
	useReducer,
	useState
} from 'react';
import { Button, Cascader, Checkbox, Form, Input, Select } from 'antd';
import { isEmpty, cloneDeep } from 'lodash';
import SvgIcon from '@/components/svg-icon';
import styles from './index.module.less';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useConfigContextValue } from '../../NodeDetailPanel';
import { useGraphContext, useGraphPageInfo } from '../../../lib/hooks';

type RowGroupItme = {
	_key: string;
	tableName: string; // 表名
	tableHeader: string; // 表头
	operator: string; // 符号
	value: string; // 值
	dataType: string | number;
};

type ColItem = {
	tableName: string;
	headers: Array<string | number | CheckboxValueType>;
};

type FormData = {
	row: Array<Array<RowGroupItme>>;
	col: Array<ColItem>;
	isFirst: boolean;
	isAll: boolean;
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
	cascaderOptions: any;
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
	row: [],

	col: [],
	isFirst: true,
	isAll: true
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

	let cascaderDefaultValue: [string, string] | [] = [];

	if (props.defaultValue.tableName) {
		cascaderDefaultValue = [
			props.defaultValue.tableName,
			`${props.defaultValue.tableHeader}#${props.defaultValue.dataType}`
		];
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

	const handleChange = (key: string, val: string | Array<any>) => {
		let newData = {
			[key]: val
		};
		if (key === 'table') {
			const field = val[1].split('#');
			newData = {
				tableName: val[0],
				tableHeader: field[0],
				dataType: field[1]
			};
		}

		filterateContext?.setRowData(props.groupIndex, props.index, {
			...props.defaultValue,
			...newData
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
			{/* <Select
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
			/> */}
			<Cascader
				className={styles['filter-box__row_item']}
				placeholder="请选择"
				options={filterateContext?.cascaderOptions}
				defaultValue={cascaderDefaultValue}
				onChange={(value) => handleChange('table', value)}
			/>
			<Select
				className={styles['filter-box__row_item']}
				defaultValue={props.defaultValue.operator}
				placeholder="请选择"
				options={symbolSelect}
				onChange={(value) => handleChange('operator', value)}
			/>
			<Input
				defaultValue={props.defaultValue.value}
				className={styles['filter-box__row_item']}
				placeholder="请输入"
				onChange={(e) => handleChange('value', e.target.value)}
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

export default () => {
	const { id, setValue, resetValue, executeByNodeConfig, config, initValue } =
		useConfigContextValue();
	const { isPublicTemplate } = useGraphContext();
	const reducer = (state: FormData, action: any) => {
		switch (action.type) {
			case 'setRowData':
				state.row[action.groupIndex][action.rowIndex] = action.data;
				state.isFirst = false;
				break;
			case 'delGroup':
				state.row.splice(action.groupIndex, 1);
				state.isFirst = false;
				break;
			case 'addGroup':
				state.row.push([
					{
						_key: getHash(),
						tableName: '', // 表名
						tableHeader: '', // 表头
						operator: '1', // 符号
						value: '', // 值
						dataType: ''
					}
				]);
				state.isFirst = false;
				break;
			case 'addRow':
				state.row[action.groupIndex].splice(action.rowIndex + 1, 0, {
					_key: getHash(),
					tableName: '', // 表名
					tableHeader: '', // 表头
					operator: '1', // 符号
					value: '', // 值
					dataType: ''
				});
				state.isFirst = false;
				break;
			case 'delRow':
				state.row[action.groupIndex].splice(action.rowIndex, 1);
				state.isFirst = false;
				break;

			case 'setCol':
				state.col = action.data;
				state.isFirst = false;
				state.isAll = action.isAll || false;
				break;
			case 'reset':
				state = {
					row: [],
					col: [],
					isFirst: true,
					isAll: true
				};
				break;
			default:
				break;
		}

		setValue({ ...state });

		return { ...state };
	};

	let initData = initValue;
	if (isEmpty(initValue)) {
		initData = cloneDeep(data);
	}
	const [formData, dispatch] = useReducer(reducer, initData);
	// return;
	const [indeterminate, setIndeterminate] = useState(false);
	const [checkAll, setCheckAll] = useState(formData.isAll);

	const [cascaderOptions, setCascaderOptions] = useState([]);
	const [colOptions, setColOptions] = useState([]);

	//获取对应配置数据
	useEffect(() => {
		setCascaderOptions(formatCascaderData(config));
		setColOptions(formatColData(config));
		executeByNodeConfig();
	}, []);

	// useEffect(() => {
	// 	set();
	// }, [formData]);

	// 处理列数据
	const formatColData = (data: any) => {
		const formCol = [];
		const list = data.map((item) => {
			const childrenArr = item.fields;
			const children: Array<{ label: string; value: string }> = [];
			const allValue: Array<string | number> = [];
			childrenArr?.forEach((el) => {
				children.push({
					label: el.description || el.fieldName, //展示描述没有展示名称
					value: el.fieldName
				});
				allValue.push(el.fieldName);
			});
			const defaultValue = formData.col.find(
				(colItem) => colItem.tableName === item.tableName
			);

			if (formData.isFirst) {
				formCol.push({
					tableName: item.tableName,
					headers: [...allValue]
				});
			}

			return {
				_key: getHash(),
				label: item.tableCnName,
				value: item.tableName,
				children: children,
				allValue,
				defaultValue: formData.isFirst
					? allValue
					: defaultValue
					? defaultValue.headers
					: []
			};
		});

		if (formData.isFirst) {
			setIndeterminate(false);
			setCheckAll(true);
			dispatch({ type: 'setCol', data: formCol || [], isAll: true });
		}

		return list;
	};

	// 拼接为级联选择器形式数据
	const formatCascaderData = (data: any) => {
		return data.map((item) => {
			const childrenArr = item.fields;
			const children: Array<{ label: string; value: string }> = [];
			childrenArr?.forEach((el) => {
				children.push({
					label: el.description || el.fieldName, //展示描述没有展示名称
					value: el.fieldName + '#' + el.dataType
				});
			});
			return {
				label: item.tableCnName,
				value: item.tableName,
				children: children
			};
		});
	};

	// 执行
	const submit = () => {
		// const params = {
		// 	canvasJson: JSON.stringify({
		// 		content: canvasData,
		// 		configs: getAllConfigs()
		// 	}),
		// 	executeId: id, //当前选中元素id
		// 	projectId: projectID
		// };
		// getResult(params).then((res: any) => {
		// 	updateTable(res.data, res.head);
		// });
		executeByNodeConfig();
	};

	// const set = () => {
	// 	if (!id || !setValue) {
	// 		return;
	// 	}

	// 	setValue(formData);
	// };

	// 重置
	const reset = () => {
		if (!id || !setValue) {
			return;
		}
		dispatch({ type: 'reset' });
		resetValue();
		onCheckAllChange(true);
		// dispatch({ type: 'setCol', data: plainOptions });
		// setIndeterminate(false);
		// setCheckAll(true);
		// set();
	};

	// 更新表单值
	const setRowData = (
		groupIndex: number,
		rowIndex: number,
		data: RowGroupItme
	) => {
		dispatch({ type: 'setRowData', groupIndex, rowIndex, data });
		// set();
	};

	// 删除组
	const delGroup = (groupIndex: number) => {
		dispatch({ type: 'delGroup', groupIndex });
		// set();
	};

	// 增加组
	const addGroup = () => {
		dispatch({ type: 'addGroup' });
		// set();
	};

	// 删除行
	const delRow = (groupIndex: number, rowIndex: number) => {
		dispatch({ type: 'delRow', groupIndex, rowIndex });
		// set();
	};

	// 新增行
	const addRow = (groupIndex: number, rowIndex: number) => {
		dispatch({ type: 'addRow', groupIndex, rowIndex });
		// set();
	};

	const onCheckAllChange = (checkedAll: boolean) => {
		const formCol = [];
		const newColOptions = [];

		colOptions.forEach((item) => {
			if (checkedAll) {
				formCol.push({
					tableName: item.value,
					headers: [...item.allValue]
				});
			}

			newColOptions.push({
				...item,
				_key: getHash(),
				defaultValue: checkedAll ? [...item.allValue] : []
			});
		});

		setIndeterminate(false);
		setCheckAll(checkedAll);
		setColOptions(newColOptions);
		dispatch({ type: 'setCol', data: formCol || [], isAll: true });
		// set();
	};

	const onChange = (tableName: string, list: CheckboxValueType[]) => {
		const optionCurrent = colOptions.find((item) => item.value === tableName);
		optionCurrent.defaultValue = list;

		setColOptions(colOptions);

		const formCurrent = formData.col.find(
			(item) => item.tableName === tableName
		);
		if (formCurrent) {
			formCurrent.headers = list;
		} else {
			formData.col.push({
				tableName,
				headers: list
			});
		}

		const isIndeter = colOptions.some(
			(item) => item.allValue.length !== item.defaultValue.length
		);

		dispatch({ type: 'setCol', data: formData.col, isAll: !isIndeter });
		setIndeterminate(isIndeter);
		setCheckAll(!isIndeter);
		// set();
	};

	return (
		<div style={{ overflowY: 'auto', paddingRight: '20px', height: '300px' }}>
			<FilterateContext.Provider
				value={{
					setRowData,
					delGroup,
					delRow,
					addRow,
					cascaderOptions
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
					<Button
						className={styles['add-group']}
						onClick={addGroup}
						disabled={isPublicTemplate}
					>
						<SvgIcon
							name="add-circle"
							className={styles['add-group__icon']}
						></SvgIcon>
						<span>添加行筛选</span>
					</Button>
				</div>

				<div className={styles['filter-box']}>
					<div className={styles['filter-box__title']}>
						<div className={styles['label']}>列筛选</div>
						<div>
							<Checkbox
								indeterminate={indeterminate}
								disabled={isPublicTemplate}
								onChange={(e) => {
									onCheckAllChange(e.target.checked);
								}}
								checked={checkAll}
							>
								全选
							</Checkbox>
						</div>
					</div>

					{colOptions.map(({ _key, label, value, children, defaultValue }) => {
						return (
							<div key={_key} className={styles['checkbox-group-item']}>
								<div>{label + ':'}</div>
								<div>
									<CheckboxGroup
										disabled={isPublicTemplate}
										className={styles['checkbox-group']}
										options={children}
										defaultValue={defaultValue}
										onChange={(val) => {
											onChange(value, val);
										}}
									/>
								</div>
							</div>
						);
					})}
				</div>
				<div className={styles.controlRow}>
					<Button
						style={{ marginRight: '10px' }}
						className={`${styles.btn} ${styles.reset}`}
						htmlType="button"
						onClick={reset}
						disabled={isPublicTemplate}
					>
						重置
					</Button>
					<Button
						className={`${styles.btn} ${styles.submit}`}
						type="primary"
						htmlType="submit"
						onClick={submit}
						disabled={isPublicTemplate}
					>
						执行
					</Button>
				</div>
			</FilterateContext.Provider>
		</div>
	);
};
