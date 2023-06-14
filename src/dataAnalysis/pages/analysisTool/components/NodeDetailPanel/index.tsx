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
import ASSETS from '../../assets/index';
import { IRootState, onClickCloseConfigPanel } from '@/redux/store';
import { CloseOutlined } from '@ant-design/icons';
import { useGraph, useGraphContext, useGraphID } from '../../lib/hooks';
import {
	IImageTypes,
	formatDataSource,
	getNodeTypeById,
	useInitRender,
	transFilterData
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
	getValue: ((id: string) => any) | null;
	setValue: ((id: string, value: any) => void) | null;
	resetValue: (id: string) => void;
	updateTable: (updateData: any, updateColumn: any) => void;
	executeByNodeConfig: () => void;
}
const ConfigContext = createContext<IConfigContext>({
	type: null,
	id: null,
	initValue: undefined,
	getValue: null,
	setValue: null,
	resetValue: function (id: string): void {
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

	const { curSelectedNode: id, showPanel = false } = state || {};
	const executeType = [IImageTypes.TABLE, IImageTypes.END];
	const projectID = useGraphID();
	const { getConfigValue, saveConfigValue, syncGraph, getAllConfigs } =
		useGraphContext();

	const isInit = useInitRender();

	useEffect(() => {
		!isInit && syncGraph();
	}, [showPanel]);

	useEffect(() => {
		handleGetNodeConfig();
	}, []);
	const handleGetNodeConfig = async () => {
		const canvasData = graph?.toJSON();
		const params = {
			id,
			canvasJson: JSON.stringify({
				content: canvasData
			})
		};
		const config = await getCanvasConfig(params);
		console.log(config);
		// const key = encodeNodeSources();
	};
	const setValue = (id: string, key: number, value: any) => {
		if (!getConfigValue(id)) {
			saveConfigValue(id, {});
		}
		const configValue = getConfigValue(id);
		saveConfigValue(id, {
			...configValue,
			[key]: value
		});
	};
	const getValue = (id: string, key: number) => {
		if (!id || !key) {
			return;
		}
		return getConfigValue(id)?.key;
	};
	const resetValue = (id: string, key: numebr, value: any) => {
		if (!getConfigValue(id)) {
			saveConfigValue(id, {});
		}
		const configValue = getConfigValue(id);
		saveConfigValue(id, {
			...configValue,
			[key]: null
		});
	};
	const executeByNodeConfig = async () => {
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
		}
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

	const downLoadData = async () => {
		const canvasData = graph.toJSON();
		const curType = getNodeTypeById(graph, id)[0] as IImageTypes;
		// 如果是筛选组件 需要特殊处理数据
		if (curType == 'FILTER') {
			const filterData = getAllConfigs();
			const formData = filterData[id];
			const cnofig = await transFilterData(id, canvasData, formData);
			try {
				const params = {
					executeId: id,
					projectId: projectID,
					canvasJson: JSON.stringify({
						content: canvasData,
						configs: cnofig
					})
				};
				await exportData(params, '导出结果.xlsx');
			} catch {
				console.log('err');
			}
		} else {
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
			<div>
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
										initValue: null,
										getValue,
										setValue,
										resetValue,
										updateTable,
										executeByNodeConfig
									}}
								>
									<ConfigPanel key={id} />
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
