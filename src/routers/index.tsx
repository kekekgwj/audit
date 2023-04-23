import { createBrowserRouter } from 'react-router-dom';

import Data from '..//dataAnalysis/pages/analysisTool';
import React from 'react';
import SQLEditor from '../dataAnalysis/pages/SQLEditor';
export default createBrowserRouter([
	{
		path: '/',
		element: <Data />
	},
	{
		path: '/data',
		element: <Data />
	},
	{
		path: '/editor',
		element: <SQLEditor />
	}
]);
