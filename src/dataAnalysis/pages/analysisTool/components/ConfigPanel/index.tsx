import React from 'react';
import JoinConfig from './JoinConfig';
import Grouping from './grouping';
import Sort from './sort';
import Filterate from './Filterate';
import { IImageTypes } from '../../lib/utils';
import { useConfigContextValue } from '../NodeDetailPanel';
interface IProps {
	type: IImageTypes;
	id: string;
	initValue: any;
}

const ConfigByType: () => JSX.Element = () => {
	const { type } = useConfigContextValue();
	if (type === IImageTypes.CONNECT) {
		return <JoinConfig />;
	}
	if (type === IImageTypes.FILTER) {
		return <Filterate />;
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
