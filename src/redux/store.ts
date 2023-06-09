import { configureStore, Store, Dispatch } from '@reduxjs/toolkit';
import rootReducer from './reducers';

function configureAppStore() {
	const store = configureStore({
		reducer: rootReducer
	});
	return store;
}
import {
	INodeDetailPanel,
	toClosePanel,
	toDoubleClickNode
} from './reducers/dataAnalysis';
import { IStoreGraph } from './reducers/knowLedgeGraphSlice';
import { IBaseState } from './reducers/base';
import { useSelector } from 'react-redux';
import {
	IFocusCenter,
	toSetCenterID,
	toSetSelectID
} from './reducers/focusCenterSlice';
export interface IRootState {
	dataAnalysis: INodeDetailPanel;
	knowledgeGraph: IStoreGraph;
	base: IBaseState;
	focusCenter: IFocusCenter;
}
export const store: Store = configureAppStore();
export const dispatch: Dispatch = store.dispatch;

export const useBaseState = () => {
	const baseState = useSelector((state: IRootState) => state.base);
	return baseState;
};

export const useFocuseState = () => {
	const focusCenterState = useSelector(
		(state: IRootState) => state.focusCenter
	);
	return focusCenterState;
};

export const onClickGraphNode = (id: string) => {
	dispatch(toDoubleClickNode({ id, showPanel: true }));
};

export const onClickCloseConfigPanel = () => {
	dispatch(toClosePanel());
};

export const onSetCenterID = ({
	centerID = null
}: {
	centerID: string | null;
}) => {
	dispatch(toSetCenterID({ centerID }));
};

export const onSetSelectID = ({
	selectID = null
}: {
	selectID: string | null;
}) => {
	dispatch(toSetSelectID({ selectID }));
};
