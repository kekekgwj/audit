import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react';
import { Table, message, ConfigProvider, notification } from 'antd';
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
			// setTableLoading(true);
			const config: any = await getCanvasConfig(params);
			if (!config || config.length < 1) {
				setIsEmptyConfig(true);
			} else {
				setIsEmptyConfig(false);
			}
			// setTableLoading(false);
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

		const isEmpty = !curConfis[id] || Object.keys(curConfis[id]).length < 2;

		// 除了table和end的类型 不存在config 不自动执行
		if (!executeType.includes(curType) && isEmpty) {
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
			setTableLoading(true);
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
			setTableLoading(false);
			return;
		}
		updateTable(data, head);
		setTableLoading(false);
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
	const Frame = () => (
		<svg
			width="22"
			height="22"
			viewBox="0 0 22 22"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g id="Frame">
				<path
					id="Vector"
					d="M11.0762 21.0526C10.6609 21.0526 10.3242 20.7159 10.3242 20.3006V16.818C10.3242 16.4027 10.6609 16.066 11.0762 16.066C11.4915 16.066 11.8281 16.4027 11.8281 16.818V20.3006C11.8281 20.7159 11.4915 21.0526 11.0762 21.0526ZM11.0762 6.31642C10.6609 6.31642 10.3242 5.97976 10.3242 5.56447V2.08185C10.3242 1.66656 10.6609 1.3299 11.0762 1.3299C11.4915 1.3299 11.8281 1.66656 11.8281 2.08185V5.56447C11.8281 5.97976 11.4915 6.31642 11.0762 6.31642ZM17.5174 18.3844C17.3249 18.3844 17.1326 18.3109 16.9857 18.1642L14.5231 15.7017C14.2294 15.408 14.2294 14.9319 14.5231 14.6382C14.8168 14.3445 15.2929 14.3445 15.5866 14.6382L18.0491 17.1007C18.3428 17.3944 18.3428 17.8705 18.0491 18.1642C17.9794 18.2341 17.8965 18.2895 17.8052 18.3273C17.714 18.3651 17.6162 18.3845 17.5174 18.3844ZM7.09748 7.96448C6.90498 7.96448 6.7127 7.89101 6.56574 7.74427L4.1032 5.28173C3.80951 4.98804 3.80951 4.51195 4.1032 4.21825C4.39689 3.92456 4.87299 3.92456 5.16668 4.21825L7.62922 6.68079C7.92291 6.97448 7.92291 7.45058 7.62922 7.74427C7.55945 7.81417 7.47656 7.86961 7.38531 7.9074C7.29406 7.94519 7.19625 7.96459 7.09748 7.96448ZM20.1855 11.9432H16.7029C16.2876 11.9432 15.951 11.6065 15.951 11.1912C15.951 10.7759 16.2876 10.4393 16.7029 10.4393H20.1855C20.6008 10.4393 20.9375 10.7759 20.9375 11.1912C20.9375 11.6065 20.6008 11.9432 20.1855 11.9432ZM5.44941 11.9432H1.9668C1.5515 11.9432 1.21484 11.6065 1.21484 11.1912C1.21484 10.7759 1.5515 10.4393 1.9668 10.4393H5.44941C5.86471 10.4393 6.20137 10.7759 6.20137 11.1912C6.20137 11.6065 5.86471 11.9432 5.44941 11.9432ZM15.0549 7.96448C14.8624 7.96448 14.6701 7.89101 14.5231 7.74427C14.2294 7.45058 14.2294 6.97448 14.5231 6.68079L16.9857 4.21825C17.2794 3.92456 17.7554 3.92456 18.0491 4.21825C18.3428 4.51195 18.3428 4.98804 18.0491 5.28173L15.5866 7.74427C15.4399 7.89101 15.2474 7.96448 15.0549 7.96448ZM4.63494 18.3844C4.44244 18.3844 4.25016 18.3109 4.1032 18.1642C3.80951 17.8705 3.80951 17.3944 4.1032 17.1007L6.56574 14.6382C6.85943 14.3445 7.33553 14.3445 7.62922 14.6382C7.92291 14.9319 7.92291 15.408 7.62922 15.7017L5.16668 18.1642C5.09691 18.2341 5.01402 18.2895 4.92277 18.3273C4.83152 18.3651 4.73371 18.3845 4.63494 18.3844Z"
					fill="url(#paint0_angular_1005_29567)"
				/>
			</g>
			<defs>
				<radialGradient
					id="paint0_angular_1005_29567"
					cx="0"
					cy="0"
					r="1"
					gradientUnits="userSpaceOnUse"
					gradientTransform="translate(11.0762 11.1912) rotate(70.7581) scale(10.3892)"
				>
					<stop stop-color="#23955C" />
					<stop offset="1" stop-color="#C1EFD8" />
				</radialGradient>
			</defs>
		</svg>
	);

	const clouseNotification = (uniqueKey: string) => {
		notification.destroy(uniqueKey);
	};

	const showNotification = (uniqueKey: string, fileName: string) => {
		notification.open({
			key: uniqueKey,
			className: 'notificationWrap',
			message: '',
			description: (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						fontSize: '14px',
						color: '#18181F',
						lineHeight: '22px'
					}}
				>
					{fileName}
					<span style={{ marginLeft: '20px', display: 'inline-block' }}>
						下载中...
					</span>
					<span className={classes.loadingIcon}>
						<Frame />
					</span>
				</div>
			),
			placement: 'bottomLeft',
			icon: <div className={classes.tableIcon} />,
			duration: null
		});
	};

	const downLoadData = async () => {
		try {
			const uniqueKey = Date.now().toString();
			const canvasData = graph.toJSON();
			showNotification(uniqueKey, '导出结果.xlsx');
			const params = {
				executeId: id,
				projectId: projectID,
				canvasJson: JSON.stringify({
					content: canvasData,
					configs: getAllConfigs()
				})
			};
			await exportData(params, '导出结果.xlsx');
			clouseNotification(uniqueKey);
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
			<div className={classes.emptyTableText}>暂无数据</div>
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
