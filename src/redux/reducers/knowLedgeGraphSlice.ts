import { createSlice } from '@reduxjs/toolkit';

export interface IStoreGraph {
	id: string | null;
	type: string | null;
}
export const initialStateGraph: IStoreGraph = {
	id: null,
	type: null
};
const graphSlice = createSlice({
	name: 'graph',
	initialState: initialStateGraph,
	reducers: {
		toClickNode(state, action) {
			state.id = action.payload.id;
			state.type = action.payload.type;
			console.log(state.id, 122222);
		},
		toClickEdge(state, action) {
			state.id = action.payload.id;
			state.type = action.payload.type;
		}
	}
});

export const { toClickNode, toClickEdge } = graphSlice.actions;

export default graphSlice.reducer;
