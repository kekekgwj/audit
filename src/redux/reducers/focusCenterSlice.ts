import { createSlice } from '@reduxjs/toolkit';

export interface IFocusCenter {
	centerID: string | null;
	selectID: string | null;
}

export const initFocusCenter: IFocusCenter = {
	centerID: null,
	selectID: null
};

const focusCenterSlice = createSlice({
	name: 'focusCenter',
	initialState: initFocusCenter,
	reducers: {
		toSetCenterID(state, action) {
			state.centerID = action.payload.centerID;
		},
		toSetSelectID(state, action) {
			state.selectID = action.payload.selectID;
		}
	}
});

export const { toSetCenterID, toSetSelectID } = focusCenterSlice.actions;

export default focusCenterSlice.reducer;
