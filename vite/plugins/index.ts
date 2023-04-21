import react from '@vitejs/plugin-react';
import createSvgIcon from './svg-icon';
import createMockServer from './mock-server';

/**
 * 创建插件
 * @param env 当前环境
 * @param command vite模式，build: 打包，serve: 开发服务器
 * @returns plugins
 */
export default function createVitePlugins(env: string, command: string) {
	const isBuild = command === 'build'; // 是否为大包模式
	const vitePlugins = [
		react(),
		createSvgIcon(isBuild),
		createMockServer(isBuild)
	];
	return vitePlugins;
}
