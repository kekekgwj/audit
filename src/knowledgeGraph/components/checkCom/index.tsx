import React, { useEffect, useState, useRef } from 'react';
import { Checkbox } from 'antd';
interface Props {
	label: string;
	name: string;
	setData: (changeData: object) => void;
	value: any; //反显传入值
	options: [];
	type: number;
}

const CheckCom = (props: Props) => {
	const { label, name, setData, value, options, type } = props;
	const [curVal, setCurVal] = useState(value || []);
	useEffect(() => {
		setData({ [name]: { value: curVal, type: type, key: name } });
	}, [curVal]);
	return (
		<Checkbox.Group
			defaultValue={curVal}
			key={label}
			options={options}
			onChange={(val) => {
				setCurVal(val);
			}}
		/>
	);
};

export default CheckCom;
