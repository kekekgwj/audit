import axios from 'axios';

const http = axios.create({
	baseURL: import.meta.env.VITE_APP_BASE_API,
	timeout: 1000
});

http.interceptors.request.use(
	(config) => {
		return config;
	},
	(error) => {
		console.log(error);
	}
);

http.interceptors.response.use(
	(res) => {
		return res.data;
	},
	(error) => {
		console.log(error);
	}
);

export default http;
