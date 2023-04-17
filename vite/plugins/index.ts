import react from '@vitejs/plugin-react';

export default function createVitePlugins(env: string) {
	const vitePlugins = [react()];
	return vitePlugins;
}
