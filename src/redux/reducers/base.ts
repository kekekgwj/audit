import { createSlice } from '@reduxjs/toolkit';
export interface IBaseState {
	token: string | null;
	user: string | null;
}

export const initialState: IBaseState = {
	token: null,
	user: null
};
const baseSlice = createSlice({
	name: 'base',
	initialState: initialState,
	reducers: {
		toSaveUser(state, action) {
			const payload = action.payload;
			state.token = payload.token;
			state.user = payload.user;
		}
	}
});

const { reducer, actions } = baseSlice;

export const { toSaveUser } = actions;
export default reducer;
