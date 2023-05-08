import { combineReducers } from '@reduxjs/toolkit';
import dataAnalysisReducer from './dataAnalysis';
import knowledgeGraphReducer from './knowLedgeGraphSlice';

const rootReducer = combineReducers({
	dataAnalysis: dataAnalysisReducer,
	knowledgeGraph: knowledgeGraphReducer
});

export default rootReducer;
