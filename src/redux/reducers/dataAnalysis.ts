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
			console.log(state, action);
			const payload: INodePaylod = action.payload;
			state.curSelectedNode = payload.id;
			state.showPanel = true;
		},
		toClosePanel(state, action) {
			state.showPanel = false;
		}
	}
});

const { reducer, actions } = dataAnalysisSlice;

export const { toDoubleClickNode, toClosePanel } = actions;
export default reducer;
