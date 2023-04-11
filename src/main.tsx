import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import Graph from './pages/graph';
import RealtionShip from './pages/relationShip';
import { store } from './redux/store';
// import router from './routes/index';
import { Provider } from 'react-redux';
const router = createBrowserRouter([
	// {
	// 	path: '/',
	// 	element: <Graph />
	// }
	{
		path: '/',
		element: <RealtionShip />
	}
]);
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	// <React.StrictMode>
	<Provider store={store}>
		<RouterProvider router={router} />
	</Provider>
	// </React.StrictMode>
);
