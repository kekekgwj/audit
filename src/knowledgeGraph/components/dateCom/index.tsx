import React, { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
interface Props {
	label: string;
	name: string;
	setData: (changeData: object) => void;
	value: any; //反显传入值
	type: number;
}

const DataCom = (props: Props) => {
	const { label, name, setData, value, type } = props;
	const [curVal, setCurVal] = useState(value || []);
	useEffect(() => {
		setData({ [name]: { value: curVal, type: type, key: name } });
	}, [curVal]);
	return (
		<RangePicker
			defaultValue={
				curVal && curVal.length
					? [dayjs(curVal[0], 'YYYY-MM-DD'), dayjs(curVal[1], 'YYYY-MM-DD')]
					: []
			}
			format={'YYYY-MM-DD'}
			onChange={(date, dateString) => setCurVal(dateString)}
		/>
	);
};

export default DataCom;
