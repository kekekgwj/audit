import { createSlice } from '@reduxjs/toolkit';
interface IStoreGraph {}
const initialStateGraph: IStoreGraph = {};
const graphSlice = createSlice({
	name: 'graph',
	initialState: initialStateGraph,
	reducers: {
		toClickNode(state, action) {}
	}
});

export const { toClickNode } = graphSlice.actions;

export default graphSlice.reducer;
