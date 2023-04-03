import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

function configureAppStore() {
	const store = configureStore({
		reducer: rootReducer
	});
	return store;
}
import { Store } from '@reduxjs/toolkit';
import { Dispatch } from '@reduxjs/toolkit';

export const store: Store = configureAppStore();
export const dispatch: Dispatch = store.dispatch;
