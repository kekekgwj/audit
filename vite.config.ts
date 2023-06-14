import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import createVitePlugins from './vite/plugins';
import removeConsole from 'vite-plugin-remove-console';
// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
	const env = loadEnv(mode, process.cwd());
	return {
		// plugins: [createVitePlugins(env.VITE_APP_ENV, command)],
		plugins: [createVitePlugins(env.VITE_APP_ENV, command), removeConsole()],
		resolve: {
			// https://cn.vitejs.dev/config/#resolve-alias
			alias: {
				src: './src',
				// 设置路径
				'~': path.resolve(__dirname, './'),
				'@': path.resolve(__dirname, './src/'),
				// 设置别名
				'@graph': path.resolve(__dirname, './src/knowledgeGraph'),
				'@sql': path.resolve(__dirname, './src/dataAnalysis')
			},
			// https://cn.vitejs.dev/config/#resolve-extensions
			extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
		},
		server: {
			host: true,
			port: 80,
			open: true,
			proxy: {
				'^/api/.*': {
					target: 'http://10.101.104.2:8100/',
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, '')
				}
			}
		},
		css: {
			modules: {
				scopeBehaviour: 'local'
			},
			preprocessorOptions: {
				less: {
					javascriptEnbled: true
				}
			}
		}
	};
});
