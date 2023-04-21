import { createBrowserRouter } from 'react-router-dom';
import RealtionShip from '@/pages/relationShip';
import AlgorithmMining from '@/pages/algorithmMining';
import MyAtlas from '@/pages/myAtlas';
import AltasDetail from '@/pages/myAtlas/detail';
import SuspiciousRule from '@/pages/suspiciousRule';
import WhiteList from '@/pages/whiteList';
export default createBrowserRouter([
	{
		path: '/',
		element: <RealtionShip />
	},
	{
		path: '/algorithmMining',
		element: <AlgorithmMining />
	},
	{
		path: '/myAtlas',
		element: <MyAtlas />
	},
	{
		path: '/suspiciousRule',
		element: <SuspiciousRule />
	},
	{
		path: '/altasDetail',
		element: <AltasDetail />
	},
	{
		path: '/whiteList',
		element: <WhiteList />
	}
]);
