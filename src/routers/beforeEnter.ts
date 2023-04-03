import { useRoutes, RouteObject } from 'react-router-dom';

const BeforeEnter = ({ routers }: { routers: RouteObject[] }) => {
	const route = useRoutes(routers);
	return route;
};

export default BeforeEnter;
