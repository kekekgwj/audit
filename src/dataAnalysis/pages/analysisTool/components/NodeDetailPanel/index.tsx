import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react';
import { Table } from 'antd';
import { useSelector } from 'react-redux';
import classes from './index.module.less';
import ConfigPanel from '../ConfigPanel';
import ASSETS from '../../assets/index';
import { IRootState, onClickCloseConfigPanel } from '@/redux/store';
import { CloseOutlined, DownloadOutlined } from '@ant-design/icons';
import { useGraph, useGraphContext, useGraphID } from '../../lib/hooks';
import {
	IImageTypes,
	formatDataSource,
	getNodeTypeById,
	useInitRender,
	encodeNodeSources
} from '../../lib/utils';
import SvgIcon from '@/components/svg-icon';
import {
	exportData,
	getCanvasConfig,
	getResult
} from '@/api/dataAnalysis/graph';

const { DOWNLOAD } = ASSETS;
interface IConfigContext {
	type: IImageTypes | null;
	id: string | null;
	initValue: any;
	getValue: () => any;
	setValue: ((value: any) => void) | null;
	resetValue: () => void;
	updateTable: (updateData: any, updateColumn: any) => void;
	executeByNodeConfig: () => void;
}
const ConfigContext = createContext<IConfigContext>({
	type: null,
	id: null,
	initValue: undefined,
	getValue: null,
	setValue: null,
	resetValue: function (): void {
		throw new Error('Function not implemented.');
	},
	updateTable: function (updateData: any, updateColumn: any): void {
		throw new Error('Function not implemented.');
	},
	executeByNodeConfig: function (): void {
		throw new Error('Function not implemented.');
	}
});

export const useConfigContextValue = () => {
	return useContext(ConfigContext);
};
export const useUpdateTable = () => {
	return useContext(ConfigContext).updateTable;
};

const useNodeKey = () => {
	const nodeKey = useRef<null | number>(null);
	const setNodeKeyFrozen = () => (nodeKey.current = null);
	const isNodeKeyReady = () => nodeKey.current !== null;
	const getNodeKey = () => {
		return nodeKey.current;
	};
	const setNodeKey = (key: number) => (nodeKey.current = key);
	return { getNodeKey, setNodeKeyFrozen, isNodeKeyReady, setNodeKey };
};
const useTableSource = () => {
	const [data, setData] = useState([]);
	const [columns, setColumns] = useState([]);

	const updateTable = (updateData: any, updateColumn: any) => {
		const { data, columns } = formatDataSource(updateData, updateColumn);
		setData(data);
		setColumns(columns);
	};
	return { data, columns, updateTable };
};

const Panel: React.FC = () => {
	const state = useSelector((state: IRootState) => state.dataAnalysis);

	const graph = useGraph();
	const { data, columns, updateTable } = useTableSource();

	const [showConfig, setShowConfig] = useState(true);

	const { curSelectedNode: id, showPanel = false, time } = state || {};

	const executeType = [IImageTypes.TABLE, IImageTypes.END];
	const projectID = useGraphID();
	const { getConfigValue, saveConfigValue, syncGraph, getAllConfigs } =
		useGraphContext();

	const [nodeConfig, setNodeConfig] = useState(null);
	const { getNodeKey, setNodeKeyFrozen, isNodeKeyReady, setNodeKey } =
		useNodeKey();
	const isInit = useInitRender();

	const [tableLoading, setTableLoading] = useState<boolean>(false);

	useEffect(() => {
		!isInit && syncGraph();
	}, [showPanel]);

	useEffect(() => {
		// setNodeKeyFrozen();
		handleGetNodeConfig();
	}, [time]);
	const handleGetNodeConfig = async () => {
		if (!graph || !id) {
			return;
		}

		const canvasData = graph?.toJSON();

		setNodeKeyFrozen();
		if (id) {
			const params = {
				id,
				canvasJson: JSON.stringify({
					content: canvasData
				})
			};
			setTableLoading(true);
			const config: any = await getCanvasConfig(params);
			setTableLoading(false);
			setNodeConfig(config);
			const tableNames = config.map((item) => item.tableName);
			const key = encodeNodeSources([...tableNames, id]);
			setNodeKey(key);
		}
	};

	const setValue = (value: any) => {
		if (!value) return;
		const nodeKey = getNodeKey();
		if (!nodeKey || !id) {
			return;
		}

		saveConfigValue(id, { ...value, key: nodeKey });
	};
	const getValue = () => {
		if (!getNodeKey() || !id) {
			return {};
		}

		const curConfig = getConfigValue(id);
		if (!curConfig || curConfig.key !== getNodeKey()) {
			return {};
		}

		return curConfig;
	};
	const resetValue = (value: any) => {
		if (!isNodeKeyReady() || !id) {
			return;
		}
		saveConfigValue(id, null);
	};
	const executeByNodeConfig = async () => {
		if (!graph) {
			return;
		}
		const canvasData = graph?.toJSON();
		if (!canvasData || !id || !projectID) {
			return;
		}

		type getParameterFirst<T> = T extends [infer first, ...infer rest]
			? first
			: null;
		type paramsType = getParameterFirst<Parameters<typeof getResult>>;
		const params: paramsType = {
			canvasJson: JSON.stringify({
				content: canvasData,
				configs: getAllConfigs()
			}),
			executeId: id, //当前选中元素id
			projectId: projectID
		};
		const { data, head } = await getResult(params);
		updateTable(data, head);
	};

	// 点击画布元素触发事件，获取对应表的数据
	useEffect(() => {
		//执行获取表数据
		if (!id || !projectID || !graph) {
			return;
		}
		const curType = getNodeTypeById(graph, id)[0] as IImageTypes;
		if (executeType.includes(curType)) {
			executeByNodeConfig();
		} else {
			//需要将表数据清空
			updateTable([], []);
		}
	}, [id]);

	if (!showPanel || !graph) {
		return null;
	}

	const toggleConfig = () => {
		setShowConfig(!showConfig);
	};

	const downLoadData = async () => {
		const canvasData = graph.toJSON();
		try {
			const params = {
				executeId: id,
				projectId: projectID,
				canvasJson: JSON.stringify({
					content: canvasData,
					configs: getAllConfigs()
				})
			};
			await exportData(params, '导出结果.xlsx');
		} catch {
			console.log('err');
		}
	};

	const clickNodeType = getNodeTypeById(graph, id)[0] as IImageTypes;
	const initValue = getValue();
	return (
		<div className={classes.container}>
			<div className={classes.data}>
				<div className={classes.download}>
					<div
						onClick={downLoadData}
						style={{
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							height: '100%'
						}}
					>
						{/* <img src={DOWNLOAD} className={classes.download_icon}></img> */}
						<DownloadOutlined style={{ color: '#24A36F', fontSize: '20px' }} />
						<span className={classes.download_text}>下载</span>
					</div>
				</div>

				<div className={classes.tableWrapper}>
					<Table
						loading={tableLoading}
						columns={columns}
						dataSource={data}
						pagination={{ defaultPageSize: 4 }}
					/>
				</div>
			</div>
			<div className={classes.rightConfigBox}>
				{!executeType.includes(clickNodeType) ? (
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
								<span
									onClick={() => toggleConfig()}
									className={classes.svgIcon}
								>
									<SvgIcon
										name="openArrow"
										className={classes.closeIcon}
									></SvgIcon>
								</span>
							) : null}
						</div>
						{showConfig ? (
							<div className={classes.configWrapper}>
								<ConfigContext.Provider
									value={{
										type: clickNodeType,
										id: id,
										initValue,
										config: nodeConfig,
										getValue,
										setValue,
										resetValue,
										updateTable,
										executeByNodeConfig
									}}
								>
									<ConfigPanel key={getNodeKey()} />
								</ConfigContext.Provider>
							</div>
						) : null}
					</div>
				) : null}
			</div>
		</div>
	);
};

export default Panel;
