import react from '@vitejs/plugin-react';
import createSvgIcon from './svg-icon';

export default function createVitePlugins(env: string) {
	const vitePlugins = [react(), createSvgIcon()];
	return vitePlugins;
}
