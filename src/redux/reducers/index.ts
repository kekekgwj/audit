import { combineReducers } from '@reduxjs/toolkit';
import dataAnalysisReducer from './dataAnalysis';
import knowledgeGraphReducer from './knowLedgeGraphSlice';
import baseReducer from './base';
import focusCenterReducer from './focusCenterSlice';
const rootReducer = combineReducers({
	dataAnalysis: dataAnalysisReducer,
	knowledgeGraph: knowledgeGraphReducer,
	base: baseReducer,
	focusCenter: focusCenterReducer
});

export default rootReducer;
