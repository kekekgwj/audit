import React from 'react';
import JoinConfig from './JoinConfig';
import Grouping from './grouping';
import Sort from './sort';
import Filterate from './Filterate';
import { IImageTypes } from '../../lib/utils';
import { useConfigContextValue } from '../NodeDetailPanel';
import { Spin } from 'antd';
interface IProps {
	type: IImageTypes;
	id: string;
	initValue: any;
}

const ConfigByType: () => JSX.Element = () => {
	const handleSubmit = (a, b, c) => {
		// 请求接口
	};

	const { type, config } = useConfigContextValue();
	if (!config) {
		return <Spin tip="Loading" size="large"></Spin>;
	}
	if (type === IImageTypes.CONNECT) {
		return <JoinConfig />;
	}
	if (type === IImageTypes.FILTER) {
		return <Filterate submit={handleSubmit} />;
	}
	if (type === IImageTypes.GROUP) {
		return <Grouping />;
	}
	if (type === IImageTypes.ORDER) {
		return <Sort />;
	}
	return <></>;
};
const ConfigPanel: React.FC = () => {
	return (
		<>
			<ConfigByType />
		</>
	);
};
export default ConfigPanel;
