import React, { useEffect } from 'react';
import { useGraphContext, useGraphPageInfo } from './lib/hooks';
import {
	getAuditProjectCanvas,
	getProjectCanvas
} from '@/api/dataAnalysis/graph';

// 以 Behavior的模式组织代码逻辑
// 当前这个behavior加载数据初始化节点和边，这个组件卸载的时候清空画布

const GraphBehavior = () => {
	const { graph, setAllConfigs } = useGraphContext();
	const { pathName, projectId } = useGraphPageInfo();
	// 初始化画布数据
	useEffect(() => {
		if (!graph || !projectId) {
			return;
		}
		// 这里要分我的模板和审计模板
		if (pathName == '我的模板') {
			(async () => {
				const res = await getProjectCanvas({ projectId });
				const { canvasJson } = res;
				const { content, configs } = JSON.parse(canvasJson);
				graph.fromJSON(content);
				setAllConfigs(configs || {});
			})();
		} else if (pathName == '审计模板') {
			(async () => {
				const res = await getAuditProjectCanvas({
					auditProjectId: projectId
				});
				const { canvasJson } = res;
				const { content, configs } = JSON.parse(canvasJson);
				graph.fromJSON(content);
				setAllConfigs(configs || {});
			})();
		}
		return () => {
			graph && graph.clearCells();
		};
	}, [projectId, graph]);

	return null;
};

export default GraphBehavior;
