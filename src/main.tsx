import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import Graph from './pages/graph';
import RealtionShip from './pages/relationShip';
import AlgorithmMining from './pages/algorithmMining';
import SuspiciousRule from './pages/suspiciousRule';
import MyAtlasCom from './pages/myAtlas';
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd';

import { store } from './redux/store';
// import router from './routes/index';
import { Provider } from 'react-redux';
const router = createBrowserRouter([
	// {
	// 	path: '/',
	// 	element: <Graph />
	// }
	{
		path: '/realtionShip',
		element: <RealtionShip />
	},
	{
		path: '/',
		element: <AlgorithmMining />
	},
	{
		path: '/rule',
		element: <SuspiciousRule />
	},
	{
		path: '/atlas',
		element: <MyAtlasCom />
	}
]);
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	// <React.StrictMode>
	<ConfigProvider locale={zhCN}>
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	</ConfigProvider>
	// </React.StrictMode>
);
