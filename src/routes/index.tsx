import { createBrowserRouter } from 'react-router-dom';
import KnowledgeGraph from '../pages/knowledgeGraph/graph';
import { RouteObject } from 'react-router';

const routes: RouteObject[] = [
	{
		path: '/',
		element: <KnowledgeGraph />
	}
];
const router = createBrowserRouter(routes);

export default routes;
