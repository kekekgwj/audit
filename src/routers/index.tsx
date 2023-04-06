import { createBrowserRouter } from 'react-router-dom';
import Graph from '../pages/graph';
import Data from '../pages/dataAnalysis';
import React from 'react';
export default createBrowserRouter([
	{
		path: '/',
		element: <Data />
	},
	{
		path: '/data',
		element: <Data />
	}
]);
