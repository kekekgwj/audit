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
import { IBaseState } from './reducers/base';
import { useSelector } from 'react-redux';
export interface IRootState {
	dataAnalysis: INodeDetailPanel;
	knowledgeGraph: IStoreGraph;
	base: IBaseState;
}
export const store: Store = configureAppStore();
export const dispatch: Dispatch = store.dispatch;

export const useBaseState = () => {
	const baseState = useSelector((state: IRootState) => state.base);
	return baseState;
};
