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
import {
	IImageTypes,
	formatDataSource,
	getNodeTypeById,
	useInitRender
} from '../../lib/utils';
import SvgIcon from '@/components/svg-icon';
import { exportData, getResult } from '@/api/dataAnalysis/graph';

const { DOWNLOAD } = ASSETS;
interface IConfigContext {
	type: IImageTypes | null;
	id: string | null;
	initValue: any;
	getValue: ((id: string) => any) | null;
	setValue: ((id: string, value: any) => void) | null;
	resetValue: (id: string) => void;
	updateTable: (updateData: any, updateColumn: any) => void;
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
	}
});

export const useConfigContextValue = () => {
	return useContext(ConfigContext);
};
export const useUpdateTable = () => {
	return useContext(ConfigContext).updateTable;
};

export const useExecuteComponentNUpdateTable = (
	id: string,
	configValue: any
) => {
	// const { graph, syncGraph, getAllConfigs } = useGraphContext();
	// const projectID = useGraphID();
	// const canvasData = graph.toJSON();
	// const updateTable = useUpdateTable();
	// const params = {
	// 	canvasJson: JSON.stringify({
	// 		content: canvasData,
	// 		// configs: { [id]: configValue }
	// 		configs: getAllConfigs()
	// 	}),
	// 	executeId: id, //当前选中元素id
	// 	projectId: projectID
	// };
	// getResult(params).then((res: any) => {
	// 	updateTable(res.data, res.head);
	// });
	// syncGraph();
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
	const {
		getConfigValue,
		saveConfigValue,
		resetConfigValue,
		syncGraph,
		getAllConfigs
	} = useGraphContext();

	const isInit = useInitRender();

	useEffect(() => {
		!isInit && syncGraph();
	}, [showPanel]);
	// 点击画布元素触发事件，获取对应表的数据
	useEffect(() => {
		//执行获取表数据
		if (!id || !projectID || !graph) {
			return;
		}
		const curType = getNodeTypeById(graph, id)[0] as IImageTypes;
		if (executeType.includes(curType)) {
			const canvasData = graph.toJSON();
			const params = {
				canvasJson: JSON.stringify({
					content: canvasData,
					configs: getAllConfigs()
				}),
				executeId: id, //当前选中元素id
				projectId: projectID
			};
			getResult(params).then((res: any) => {
				updateTable(res.data, res.head);
			});
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
			console.log('config:', getAllConfigs());
			const res = await exportData(params);
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
										getValue: getConfigValue,
										setValue: saveConfigValue,
										resetValue: resetConfigValue,
										updateTable: updateTable
									}}
								>
									<ConfigPanel key={id} />
								</ConfigContext.Provider>
							</div>
						) : null}
					</div>
				) : null}
			</div>

			{/* <div
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
			</div> */}
		</div>
	);
};

export default Panel;
