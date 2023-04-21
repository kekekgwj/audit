import React from 'react';
import JoinConfig from './JoinConfig';
import { Table } from 'antd';
interface IProps {
	data?: any[];
	children: React.ReactNode;
}
const ConfigPanel: React.FC<IProps> = ({ children }) => {
	return (
		<div>
			<div>{children}</div>
			<div></div>
		</div>
	);
};

export const JoinConfigPanel = () => (
	<ConfigPanel>
		<JoinConfig></JoinConfig>
	</ConfigPanel>
);
export default ConfigPanel;
