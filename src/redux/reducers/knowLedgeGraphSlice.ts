import { createSlice } from '@reduxjs/toolkit';

export interface INodeInfo {
	id: string | null;
	x: Number | null;
	y: Number | null;
}
export const initialStateGraph: INodeInfo = {
	id: null,
	x: null,
	y: null
};

const graphSlice = createSlice({
	name: 'graph',
	initialState: initialStateGraph,
	reducers: {
		toClickNode(state, action) {
			state.id = action.payload.id;
			state.x = action.payload.x;
			state.y = action.payload.y;
			console.log(state.id, 122222);
		}
	}
});
export const { toClickNode } = graphSlice.actions;
export default graphSlice.reducer;
