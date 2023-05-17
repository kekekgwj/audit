import { combineReducers } from '@reduxjs/toolkit';
import dataAnalysisReducer from './dataAnalysis';
import knowledgeGraphReducer from './knowLedgeGraphSlice';
import baseReducer from './base';
const rootReducer = combineReducers({
	dataAnalysis: dataAnalysisReducer,
	knowledgeGraph: knowledgeGraphReducer,
	base: baseReducer
});

export default rootReducer;
