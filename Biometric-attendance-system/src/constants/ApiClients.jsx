import axios from 'axios';
import { toast } from 'react-hot-toast';

const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    }, 
});

apiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

apiClient.interceptors.response.use(
    response => response,
    async error => {
        const { response } = error;
        if (response.status === 401 && response.data.error === 'Token expired') {
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const { data } = await axios.post('/api/admin/refresh-token', { refreshToken });

                localStorage.setItem('token', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);

                response.config.headers.Authorization = `Bearer ${data.accessToken}`;
                return axios(response.config);
            } catch (refreshError) {
                toast.error('Session expired. Please log in again.');
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
