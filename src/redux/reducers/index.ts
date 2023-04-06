import { createSlice } from '@reduxjs/toolkit';
// interface IStoreGraph {}
export interface IStoreGraph {
	id: string | null;
	x: Number | null;
	y: Number | null;
	source: string | null;
	target: string | null;
}
export const initialStateGraph: IStoreGraph = {
	id: null,
	x: null,
	y: null,
	source: null,
	target: null
};
// const initialStateGraph: IStoreGraph = {
// 	id: '',
// 	x: '',
// 	y: ''
// };
const graphSlice = createSlice({
	name: 'graph',
	initialState: initialStateGraph,
	reducers: {
		toClickNode(state, action) {
			state.id = action.payload.id;
			state.x = action.payload.x;
			state.y = action.payload.y;
			console.log(state.id, 122222);
		},
		toClickEdge(state, action) {
			state.id = action.payload.id;
			state.source = action.payload.source;
			state.target = action.payload.target;
		}
	}
});

export const { toClickNode, toClickEdge } = graphSlice.actions;

export default graphSlice.reducer;
