import { message } from 'antd';
import modal from 'antd/es/modal';
import Cookies from 'js-cookie';

// http request
export async function http<T>(request: RequestInfo): Promise<T> {
	const response = await fetch(request);
	try {
		const body = await response.json();
		if (response.ok) {
			return body.data;
		} else {
			throw body;
		}
	} catch (e) {
		console.error(e);

		if (e.code === 401) {
			const timer = localStorage.getItem('openLoginTime');
			const now = Date.now();
			if (!timer) {
				// window.location.href = 'http://audit.zhejianglab.com/login';
				localStorage.setItem('openLoginTime', now);
				createTokenMessage().then(() => {
					window.open('http://audit.zhejianglab.com/login');
				});
			} else {
				if (now - +timer > 5000) {
					localStorage.setItem('openLoginTime', now);
					createTokenMessage().then(() => {
						window.open('http://audit.zhejianglab.com/login');
					});
				}
			}
		} else {
			message.warning(e?.msg || '系统错误');
		}

		return Promise.reject(e);
	}
}

export async function download(request: RequestInfo, fileName: string) {
	try {
		const response = await fetch(request);

		console.log('response', response);
		if (response.status === 400) {
			message.warning('下载失败');
			return;
		}

		const blob = await response.blob();
		const url = window.URL.createObjectURL(new Blob([blob]));
		const link = document.createElement('a');
		link.style.display = 'none';
		link.href = url;
		link.setAttribute('download', fileName);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		window.URL.revokeObjectURL(url);
	} catch (e) {
		message.warning(e?.msg || '下载失败');
		return Promise.reject(e);
	}
}

export async function get<T>(
	path: string,
	args: RequestInit = {
		method: 'get',
		headers: {
			'Blade-Auth': `${Cookies.get('token')}`
		}
	}
): Promise<T> {
	return await http<T>(new Request(path, args));
}
export async function post<T>(
	path: string,
	body: any,
	args: RequestInit = {
		method: 'post',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json',
			'Blade-Auth': `${Cookies.get('token')}`
		}
	}
): Promise<T> {
	return await http<T>(new Request(path, args));
}

export async function postFormData<T>(
	path: string,
	formData: any,
	args: RequestInit = {
		method: 'post',
		body: formData,
		headers: {
			'Blade-Auth': `${Cookies.get('token')}`
		}
	}
	// 不设置Content-Type 浏览器自动识别
): Promise<T> {
	return await http<T>(new Request(path, args));
}

export const appendQueryParams: (
	url: string,
	params?: { [key: string]: string | number }
) => string = (url, params) => {
	let queryParams = '';

	params &&
		Object.keys(params).forEach((key) => {
			queryParams = queryParams.concat(key, '=', String(params[key]), '&');
		});
	return `${url}?${queryParams}`.slice(0, -1);
};

const createTokenMessage = (secondsToGo = 3) => {
	return new Promise((resolve) => {
		const modalBox = document.createElement('div');
		modalBox.className = 'modal-box';
		const loginModal = document.createElement('div');
		loginModal.innerHTML = `<div class="title">登录过期,请重新登录</div><div class="seconds">${secondsToGo}s</div>`;

		loginModal.className = 'model-login';

		modalBox.appendChild(loginModal);

		document.body.appendChild(modalBox);

		// const instance = modal.warning({
		// 	title: '登录状态失效',
		// 	content: `${secondsToGo} 秒后跳转登录页.`,
		// 	footer: null
		// });

		const timer = setInterval(() => {
			secondsToGo -= 1;
			loginModal.innerHTML = `<div class="title">登录过期,请重新登录</div><div class="seconds">${secondsToGo}s</div>`;
		}, 1000);

		setTimeout(() => {
			clearInterval(timer);
			document.body.removeChild(modalBox);
			resolve(true);
		}, secondsToGo * 1000);
	});
};
