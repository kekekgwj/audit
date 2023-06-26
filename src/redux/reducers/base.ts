import { createSlice } from '@reduxjs/toolkit';
export interface IBaseState {
	token: string | null;
	user: string | null;
	isAdmin: boolean;
}

export const initialState: IBaseState = {
	token: null,
	user: null,
	isAdmin: true
};
const baseSlice = createSlice({
	name: 'base',
	initialState: initialState,
	reducers: {
		// toSaveUser(state, action) {
		// 	const payload = action.payload;
		// 	state.token = payload.token;
		// 	state.user = payload.user;
		// },
		saveIsAdmin(state, action) {
			const payload = action.payload;
			state.isAdmin = payload.isAdmin;
		}
	}
});

const { reducer, actions } = baseSlice;
export const { saveIsAdmin } = actions;
// export const { toSaveUser, saveIsAdmin } = actions;
export default reducer;
