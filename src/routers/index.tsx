import { createBrowserRouter } from 'react-router-dom';
import RealtionShip from '@/pages/relationShip';
import AlgorithmMining from '@/pages/algorithmMining';
export default createBrowserRouter([
	// {
	// 	path: '/',
	// 	element: <Graph />
	// },
	// {
	// 	path: '/realtionShip',
	// 	element: <RealtionShip />
	// },
	{
		path: '/',
		element: <RealtionShip />
	},
	{
		path: '/algorithmMining',
		element: <AlgorithmMining />
	}
]);
