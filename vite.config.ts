import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import createVitePlugins from './vite/plugins';

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
	const env = loadEnv(mode, process.cwd());
	return {
		plugins: [createVitePlugins(env.VITE_APP_ENV, command)],
		resolve: {
			// https://cn.vitejs.dev/config/#resolve-alias
			alias: {
				// 设置路径
				'~': path.resolve(__dirname, './'),
				// 设置别名
				'@': path.resolve(__dirname, './src')
			},
			// https://cn.vitejs.dev/config/#resolve-extensions
			extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
		},
		server: {
			host: true,
			port: 80,
			open: true
		},
		css: {
			preprocessorOptions: {
				less: {
					javascriptEnbled: true
				}
			}
		}
	};
});
