import { toSaveUser } from '@/redux/reducers/base';
import { useBaseState } from '@/redux/store';
import { useLocation } from 'react-router-dom';
function BeforeEnter({ children }: { children: React.ReactNode }) {
	const state = useBaseState();
	// 	headers: { 'Blade-Auth': Cookies.get("token") },
	if (!state.token) {
		const location = useLocation();
		const searchParams: Record<string, string> = {};

		const search = (location.search || '').substring(1);
		search.split('&').forEach((item) => {
			const [key, value] = item.split('=');
			searchParams[key] = value;
		});
		toSaveUser(searchParams.token);
	}

	return <>{children}</>;
}
export default BeforeEnter;
