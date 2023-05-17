import OWNS from './OWNS';
import DONATED from './DONATED';

interface RegisterNodes {
	[key: string]: () => void;
}

const registerEdges: RegisterNodes = {
	OWNS,
	DONATED
};

/**
 * 注册自定义节点方法
 * @param nodes 需要注册的节点
 */
export default (nodes: string[] | 'all') => {
	if (nodes === 'all') {
		// 注册所有registerNodes中定义的自定义节点
		Object.keys(registerEdges).forEach((node) => {
			registerEdges[node]();
		});
	} else {
		nodes.forEach((node) => {
			registerEdges[node] && registerEdges[node]();
		});
	}
};
