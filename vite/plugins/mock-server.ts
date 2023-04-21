import { viteMockServe } from 'vite-plugin-mock';

export default function createMockServer(isBuild: boolean) {
	return viteMockServe({
		mockPath: 'mocks',
		localEnabled: !isBuild
	});
}
