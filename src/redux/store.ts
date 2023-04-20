import { configureStore, Store, Dispatch } from '@reduxjs/toolkit';
import rootReducer from './reducers';

function configureAppStore() {
	const store = configureStore({
		reducer: rootReducer
	});
	return store;
}

export const store: Store = configureAppStore();
export const dispatch: Dispatch = store.dispatch;
