import Cookies from 'js-cookie';
import { toSaveUser } from '@/redux/reducers/base';
import { useBaseState } from '@/redux/store';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getIsAdmin, refreshToken } from '@/api/common';

import { changeIsAdmin } from '@/redux/store';

function BeforeEnter({ children }: { children: React.ReactNode }) {
	const state = useBaseState();
	// 	headers: { 'Blade-Auth': Cookies.get("token") },

	useEffect(() => {
		getisAdmin();

		// refreshtoken();

		// setInterval(() => {

		// }, 30 * 60 * 1000);
	}, []);

	const getisAdmin = async () => {
		try {
			const res = await getIsAdmin();
			changeIsAdmin(res);
		} catch (e) {
			console.error(e);
		}
	};

	// const refreshtoken = async () => {
	// 	const res = await refreshToken({
	// 		tenantId: '000000',
	// 		refresh_token: Cookies.get('token')
	// 	});

	// 	console.log(res, 'iiiiii');
	// };

	// if (!state.token) {
	// 	const location = useLocation();
	// 	const searchParams: Record<string, string> = {};

	// 	const search = (location.search || '').substring(1);
	// 	search.split('&').forEach((item) => {
	// 		const [key, value] = item.split('=');
	// 		searchParams[key] = value;
	// 	});

	// 	toSaveUser(searchParams.token);
	// }

	return <>{children}</>;
}
export default BeforeEnter;
