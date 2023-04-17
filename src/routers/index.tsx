import { createBrowserRouter } from 'react-router-dom';
import RealtionShip from '@/pages/relationShip';
import AlgorithmMining from '@/pages/algorithmMining';
import MyAtlas from '@/pages/myAtlas';
import SuspiciousRule from '@/pages/suspiciousRule';
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
	}
]);
