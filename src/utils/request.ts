import { message } from 'antd';
import Cookies from 'js-cookie';

// http request
export async function http<T>(request: RequestInfo): Promise<T> {
	const response = await fetch(request);
	try {
		const body = await response.json();
		console.log({ response });
		if (response.ok) {
			return body.data;
		} else {
			throw body;
		}
	} catch (e) {
		console.error(e);

		if (e.code === 401) {
			window.location.href = 'http://audit.zhejianglab.com/login';
		}

		message.warning(e?.msg || '系统错误');

		return Promise.reject(e);
	}
}

export async function download(request: RequestInfo, fileName: string) {
	try {
		const response = await fetch(request);
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
		console.log(e);
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
