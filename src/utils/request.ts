// http request
export async function http<T>(request: RequestInfo): Promise<T> {
	const response = await fetch(request);
	try {
		const body = await response.json();
		if (response.ok) {
			return body.data;
		} else {
			throw 'request failed';
		}
	} catch (e) {
		console.error(e);
		return Promise.reject(e);
	}
}

export async function get<T>(
	path: string,
	args: RequestInit = { method: 'get' }
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
			'Content-Type': 'application/json'
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
		body: formData
	}
	// 不设置Content-Type 浏览器自动识别
): Promise<T> {
	return await http<T>(new Request(path, args));
}

export const appendQueryParams: (
	url: string,
	params: { [key: string]: string | number }
) => string = (url, params) => {
	let queryParams = '';
	Object.keys(params).forEach((key) => {
		queryParams = queryParams.concat(key, '=', String(params[key]), '&');
	});
	return `${url}?${queryParams}`.slice(0, -1);
};
