import { combineReducers, createSlice } from '@reduxjs/toolkit';
import knowLedgeGraphReducer, { INodeInfo } from './knowLedgeGraphSlice';
import dataAnaylsisReducer, { INodeDetailPanel } from './dataAnalysis';
const rootReducer = combineReducers({
	knowLedgeGraph: knowLedgeGraphReducer,
	dataAnaylsis: dataAnaylsisReducer
});

export interface IGlobalState {
	knowLedgeGraph: INodeInfo;
	dataAnaylsis: INodeDetailPanel;
}
export default rootReducer;
