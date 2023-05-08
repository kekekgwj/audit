import { createSlice } from '@reduxjs/toolkit';

export interface INodeDetailPanel {
	curSelectedNode: string | null;
	showPanel: boolean;
}
export interface INodePaylod {
	id: string;
}
export const initialState: INodeDetailPanel = {
	curSelectedNode: null,
	showPanel: false
};
const dataAnalysisSlice = createSlice({
	name: 'dataAnalysis',
	initialState: initialState,
	reducers: {
		toDoubleClickNode(state, action) {
			const payload: INodePaylod = action.payload;
			state.curSelectedNode = payload.id;
			state.showPanel = true;
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
