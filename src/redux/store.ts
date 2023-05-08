import { configureStore, Store, Dispatch } from '@reduxjs/toolkit';
import rootReducer from './reducers';

function configureAppStore() {
	const store = configureStore({
		reducer: rootReducer
	});
	return store;
}
import { INodeDetailPanel } from './reducers/dataAnalysis';
import { IStoreGraph } from './reducers/knowLedgeGraphSlice';
export interface IRootState {
	dataAnalysis: INodeDetailPanel;
	knowledgeGraph: IStoreGraph;
}
export const store: Store = configureAppStore();
export const dispatch: Dispatch = store.dispatch;
