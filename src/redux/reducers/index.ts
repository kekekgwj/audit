import { combineReducers, createSlice } from '@reduxjs/toolkit';
import knowLedgeGraphReducer from './knowLedgeGraphSlice';

const rootReducer = combineReducers({
	knowLedgeGraph: knowLedgeGraphReducer,
	dataAnaylsis
});
export default graphSlice.reducer;
