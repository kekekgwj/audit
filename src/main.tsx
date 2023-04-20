import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { store } from './redux/store';
import router from './routers/index';
import 'virtual:svg-icons-register';
import './index.css';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	// <React.StrictMode>
	<ConfigProvider locale={zhCN}>
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	</ConfigProvider>
	// </React.StrictMode>
);
