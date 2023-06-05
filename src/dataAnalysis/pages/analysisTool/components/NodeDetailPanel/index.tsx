import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState
} from 'react';
import { Table } from 'antd';
import { useSelector } from 'react-redux';
import classes from './index.module.less';
import ConfigPanel from '../ConfigPanel';
import { ColumnsType } from 'antd/es/table';
import ASSETS from '../../assets/index';
import { IRootState, onClickCloseConfigPanel } from '@/redux/store';
import { CloseOutlined } from '@ant-design/icons';
import { useGraph, useGraphContext, useGraphID } from '../../lib/Graph';
import { IImageTypes, getNodeTypeById, syncData } from '../../lib/utils';
import SvgIcon from '@/components/svg-icon';
import { exportData } from '@/api/dataAnalysis/graph';
const { DOWNLOAD } = ASSETS;
interface IConfigContext {
	type: IImageTypes | null;
	id: string | null;
	initValue: any;
	getValue: ((id: string) => any) | null;
	setValue: ((id: string, value: any) => void) | null;
	resetValue: (id: string) => void;
}
const ConfigContext = createContext<IConfigContext>({
	type: null,
	id: null,
	initValue: undefined,
	getValue: null,
	setValue: null,
	resetValue: function (id: string): void {
		throw new Error('Function not implemented.');
	}
});

export const useConfigContextValue = () => {
	return useContext(ConfigContext);
};
const useTableSource = () => {
	interface DataType {
		key: React.Key;
		name: string;
		age: number;
		address: string;
	}
	const columnsMock: ColumnsType<DataType> = [
		{
			title: 'Name',
			dataIndex: 'name'
		},
		{
			title: 'Age',
			dataIndex: 'age'
		},
		{
			title: 'Address',
			dataIndex: 'address'
		}
	];
	const dataMock: DataType[] = [];
	for (let i = 0; i < 46; i++) {
		dataMock.push({
			key: i,
			name: `Edward King ${i}`,
			age: 32,
			address: `London, Park Lane no. ${i}`
		});
	}
	const [data, setData] = useState(dataMock);
	const [column, setColumn] = useState(columnsMock);
	const updateTable = (updateData, updateColumn) => {
		setData(updateData);
		setColumn(updateColumn);
	};
	return [data, column, updateTable];
};

const Panel: React.FC = () => {
	const state = useSelector((state: IRootState) => state.dataAnalysis);
	const graph = useGraph();
	const [data, columns, updateTable] = useTableSource();
	const [showConfig, setShowConfig] = useState(true);
	const { curSelectedNode: id, showPanel = false } = state || {};
	const projectID = useGraphID();
	const { getConfigValue, saveConfigValue, resetConfigValue, getAllConfigs } =
		useGraphContext();
	// useEffect(() => {
	// 	syncData(projectID, graph, getAllConfigs);
	// }, [showPanel]);
	if (!showPanel || !graph) {
		return null;
	}

	const toggleConfig = () => {
		setShowConfig(!showConfig);
	};

	const downLoadData = async () => {
		try {
			const data = {
				projectId: projectID
			};
			const res = await exportData(data);
			console.log('导出结果：', res);
		} catch {
			console.log('err');
		}
	};

	const clickNodeType = getNodeTypeById(graph, id)[0] as IImageTypes;

	return (
		<div className={classes.container}>
			<div className={classes.data}>
				<div className={classes.download}>
					<img src={DOWNLOAD} className={classes.download_icon}></img>
					<span className={classes.download_text} onClick={downLoadData}>
						下载
					</span>
					<CloseOutlined
						className={classes.closeIcon}
						onClick={onClickCloseConfigPanel}
					/>
				</div>
				<div className={classes.tableWrapper}>
					<Table
						columns={columns}
						dataSource={data}
						pagination={{ defaultPageSize: 4 }}
					/>
				</div>
			</div>

			<div
				className={`${
					showConfig ? classes.configPanel : classes.hideConfigPanel
				}`}
			>
				<div className={classes.configPanel_title}>
					{!showConfig ? (
						<span
							onClick={() => toggleConfig()}
							className={classes.svgIcon}
							style={{ marginRight: '5px' }}
						>
							<SvgIcon
								name="closeArrow"
								className={classes.closeIcon}
							></SvgIcon>
						</span>
					) : null}
					<span className={classes.configPanel_title_text}>参数配置</span>
					{showConfig ? (
						<span onClick={() => toggleConfig()} className={classes.svgIcon}>
							<SvgIcon name="openArrow" className={classes.closeIcon}></SvgIcon>
						</span>
					) : null}
				</div>
				{showConfig ? (
					<div className={classes.configWrapper}>
						<ConfigContext.Provider
							value={{
								type: clickNodeType,
								id: id,
								initValue: null,
								getValue: getConfigValue,
								setValue: saveConfigValue,
								resetValue: resetConfigValue
							}}
						>
							<ConfigPanel key={id} />
						</ConfigContext.Provider>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default Panel;
