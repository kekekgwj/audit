import path from 'path';
import { defineConfig } from 'vite';
import createVitePlugins from './vite/plugins';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [createVitePlugins('dev')],
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
		port: 80,
		host: true,
		open: true
		// proxy: {
		// 	// https://cn.vitejs.dev/config/#server-proxy
		// 	'/dev-api': {
		// 		target: '',
		// 		changeOrigin: true,
		// 		rewrite: (p) => p.replace(/^\/dev-api/, '')
		// 	},
		// }
	}
});
