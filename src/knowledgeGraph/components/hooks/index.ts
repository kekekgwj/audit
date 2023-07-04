import { INextGraphParam } from '@/api/knowLedgeGraph/graphin';
import { GraphinData } from '@antv/graphin';
import { createContext, useContext, useRef } from 'react';
interface INextGraphRef {
	[nodeId: string]: string[];
}
type ISetNextGraphInfo = ({
	nodeID,
	relations
}: {
	nodeID: number;

	relations: string[];
}) => void;
type IGetNextGraphInfo = (nodeID: number) => string[];
interface IGraphContext {
	searchNewGraph: (nextGraphParam: INextGraphParam) => void;
	updateData: ((data: GraphinData) => void) | null;
	data: Record<string, any> | null;
	refresh: boolean;
	setNextGraphInfo: ISetNextGraphInfo;
	getNextGraphInfo: IGetNextGraphInfo;
	resetAllNextGraph: () => void;
}
export const GraphContext = createContext<IGraphContext>({
	updateData: null,
	data: null,
	refresh: false,
	setNextGraphInfo: function ({
		nodeID,
		relations
	}: {
		nodeID: number;
		relations: string[];
	}): void {
		throw new Error('Function not implemented.');
	},
	getNextGraphInfo: function (nodeID: number): string[] {
		throw new Error('Function not implemented.');
	},
	searchNewGraph: function (nextGraphParam: INextGraphParam): void {
		throw new Error('Function not implemented.');
	},
	resetAllNextGraph: function (): void {
		throw new Error('Function not implemented.');
	}
});
export const useGraphContext = () => {
	return useContext(GraphContext);
};
// 用于记录穿透下一层节点的勾选 id - path - nodes/edges
export const useNextGraphRef = () => {
	const ref = useRef<INextGraphRef>({});
	const setNextGraphInfo: ISetNextGraphInfo = ({ nodeID, relations }) => {
		ref.current[nodeID] = relations;
	};
	const resetAllNextGraph = () => {
		ref.current = {};
	};
	const getNextGraphInfo = (nodeID: number): string[] => {
		return ref.current[nodeID] || [];
	};
	const formatRelations = (): INextGraphParam[] => {
		const refCur = ref.current;
		if (!refCur || Object.keys(refCur).length === 0) {
			return [];
		}
		const ids = Object.keys(refCur);

		const relations = ids.map((id) => {
			return {
				nodeId: Number(id),
				relationships: refCur[id]
			};
		});
		return relations.filter((v) => v.relationships.length > 0);
	};
	const getAllNextGraphInfo = (): INextGraphParam[] => {
		return formatRelations();
	};

	return {
		setNextGraphInfo,
		getNextGraphInfo,
		resetAllNextGraph,
		getAllNextGraphInfo
	};
};
