import { createBrowserRouter } from 'react-router-dom';
import Graph from '../pages/graph';
import RealtionShip from '../pages/relationShip';
import React from 'react';
export default createBrowserRouter([
	// {
	// 	path: '/',
	// 	element: <Graph />
	// },
	{
		path: '/realtionShip',
		element: <RealtionShip />
	}
]);
