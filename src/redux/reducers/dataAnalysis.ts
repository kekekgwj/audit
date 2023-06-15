import { createSlice } from '@reduxjs/toolkit';

export interface INodeDetailPanel {
	curSelectedNode: string | null;
	showPanel: boolean;
	time: number;
}
export interface INodePaylod {
	id: string;
}
export const initialState: INodeDetailPanel = {
	curSelectedNode: null,
	showPanel: false,
	time: 0
};
const dataAnalysisSlice = createSlice({
	name: 'dataAnalysis',
	initialState: initialState,
	reducers: {
		toDoubleClickNode(state, action) {
			const payload: INodePaylod = action.payload;
			state.curSelectedNode = payload.id;
			state.showPanel = true;
			// 强制刷新
			state.time = Date.now();
		},
		toClosePanel(state) {
			state.showPanel = false;
			state.curSelectedNode = null;
		}
	}
});

const { reducer, actions } = dataAnalysisSlice;

export const { toDoubleClickNode, toClosePanel } = actions;
export default reducer;
