import Company from './Company';
import Person from './Person';
import Property from './Property';
import Recipient from './Recipient';

interface RegisterNodes {
	[key: string]: () => void;
}

const registerNodes: RegisterNodes = {
	Company,
	Person,
	Property,
	Recipient
};

/**
 * 注册自定义节点方法
 * @param nodes 需要注册的节点
 */
export default (nodes: string[] | 'all') => {
	if (nodes === 'all') {
		// 注册所有registerNodes中定义的自定义节点
		Object.keys(registerNodes).forEach((node) => {
			registerNodes[node]();
		});
	} else {
		nodes.forEach((node) => {
			registerNodes[node] && registerNodes[node]();
		});
	}
};
