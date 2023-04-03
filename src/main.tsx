import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import Graph from './pages/graph';
// import router from './routes/index';
const router = createBrowserRouter([
	{
		path: '/',
		element: <Graph />
	}
]);
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	// <React.StrictMode>
	<RouterProvider router={router} />
	// </React.StrictMode>
);
