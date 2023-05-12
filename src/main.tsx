import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';

import { store } from './redux/store';
import Router from './routers/index';
import zhCN from 'antd/lib/locale/zh_CN';

import 'virtual:svg-icons-register';
import '@/assets/styles/index.less';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	// <React.StrictMode>
	<ConfigProvider
		locale={zhCN}
		theme={{
			token: {
				colorPrimary: '#24A36F'
			}
		}}
	>
		<Provider store={store}>
			<BrowserRouter>
				<Router></Router>
			</BrowserRouter>
			{/* <RouterProvider router={router} /> */}
		</Provider>
	</ConfigProvider>
	// </React.StrictMode>
);
