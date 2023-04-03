import { createBrowserRouter } from 'react-router-dom';
import Graph from '../pages/graph';
import React from 'react';
export default createBrowserRouter([
	{
		path: '/',
		element: <Graph />
	}
]);
