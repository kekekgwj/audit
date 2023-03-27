import { createBrowserRouter } from 'react-router-dom';
import Graph from '../pages/knowledgeGraph';
import { RouteObject } from 'react-router';

export const routes: RouteObject[] = [
	{
		path: '/',
		element: Graph
	}
];
const router = createBrowserRouter(routes);

export default router;
