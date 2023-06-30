import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react';
import { Table, message, ConfigProvider } from 'antd';
import { useSelector } from 'react-redux';
import classes from './index.module.less';
import ConfigPanel from '../ConfigPanel';
import ASSETS from '../../assets/index';
import { IRootState, onClickCloseConfigPanel } from '@/redux/store';
import { CloseOutlined, DownloadOutlined } from '@ant-design/icons';
import {
	useGraph,
	useGraphContext,
	useGraphID,
	useGraphPageInfo
} from '../../lib/hooks';
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
	getResult,
	getResultByAuditProject
} from '@/api/dataAnalysis/graph';
import emptyPage from '@/assets/img/empty-data.png';
import ResizeTable from '../myTable/';

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
	const [columns, setColumns] = useState<any[]>([]);

	const updateTable = (updateData: any, updateColumn: any) => {
		const { data, columns } = formatDataSource(updateData, updateColumn);
		setData(data);
		setColumns(columns);
	};
	return { data, columns, updateTable };
};

const Panel: React.FC = () => {
	const { pathName } = useGraphPageInfo();
	const state = useSelector((state: IRootState) => state.dataAnalysis);

	const graph = useGraph();
	const { data, columns, updateTable } = useTableSource();

	const [showConfig, setShowConfig] = useState(true);

	// 是否配置为空
	const [isEmptyConfig, setIsEmptyConfig] = useState(true);

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

	// 分页
	const [current, setCurrent] = useState(1);
	const [total, setTotal] = useState(0);
	const currentRef = useRef();
	useEffect(() => {
		currentRef.current = current;
	}, [current]);

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
			if (!config || config.length < 1) {
				setIsEmptyConfig(true);
			} else {
				setIsEmptyConfig(false);
			}
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
		const curConfis = getAllConfigs();
		const curType = getNodeTypeById(graph, id)[0] as IImageTypes;
		// 除了table和end的类型 不存在config 不自动执行
		if (!executeType.includes(curType) && !curConfis[id]) {
			updateTable([], []);
			return;
		}

		const params: paramsType = {
			canvasJson: JSON.stringify({
				content: canvasData,
				configs: curConfis
			}),
			executeId: id, //当前选中元素id
			projectId: projectID,
			current: currentRef.current,
			size: 10
		};

		let data, head, totalNum;
		try {
			if (pathName === '审计模板') {
				const res = await getResultByAuditProject({
					auditProjectId: projectID,
					executeId: id,
					current: currentRef.current,
					size: 10
				});
				data = res.data;
				head = res.head;
				totalNum = res.total;
			} else {
				const res = await getResult(params);
				data = res.data;
				head = res.head;
				totalNum = res.total;
			}
		} catch (e) {
			updateTable([], []);
			return;
		}
		updateTable(data, head);
		setTotal(totalNum);
	};

	// 点击画布元素触发事件，获取对应表的数据
	useEffect(() => {
		//执行获取表数据
		if (!id || !projectID || !graph) {
			return;
		}
		setCurrent(1); //id改变 重置页码

		executeByNodeConfig();
		// if (executeType.includes(curType)) {
		// 	executeByNodeConfig();
		// } else {
		// 	//需要将表数据清空
		// 	updateTable([], []);
		// }
	}, [id]);

	if (!showPanel || !graph) {
		return null;
	}

	const toggleConfig = () => {
		setShowConfig(!showConfig);
	};

	// 分页改变
	const searchChange = (page) => {
		console.log(page, 267267);
		setCurrent(page);
		setTimeout(() => {
			executeByNodeConfig();
		}, 200);
	};

	// useEffect(() => {
	// 	executeByNodeConfig();
	// }, [current]);

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
	const customizeRenderEmpty = () => (
		//这里面就是我们自己定义的空状态
		<div className={classes.emptyTableBox}>
			<img src={emptyPage} alt="" />
		</div>
	);

	return (
		<div className={classes.container}>
			<div className={classes.data}>
				{pathName == '我的模板' ? (
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
							<DownloadOutlined
								style={{ color: '#24A36F', fontSize: '20px' }}
							/>
							<span className={classes.download_text}>下载</span>
						</div>
					</div>
				) : !executeType.includes(clickNodeType) ? (
					<div className={classes.download}></div>
				) : null}
				<div className={classes.tableWrapper}>
					<ConfigProvider renderEmpty={customizeRenderEmpty}>
						{/* <Table
							loading={tableLoading}
							columns={columns}
							dataSource={data}
							pagination={{ defaultPageSize: 10 }}
						/> */}
						<ResizeTable
							columnsData={columns}
							dataSource={data}
							loading={tableLoading}
							key={columns}
							searchChange={searchChange}
							current={currentRef.current}
							total={total}
						></ResizeTable>
					</ConfigProvider>
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
									{!isEmptyConfig ? (
										<ConfigPanel key={getNodeKey()} />
									) : (
										<div className={classes.emptyConfig}>缺少数据表配置</div>
									)}
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
