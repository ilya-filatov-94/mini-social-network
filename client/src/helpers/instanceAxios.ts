import axios from 'axios';
import {API_URL} from '../env_variables';
import {IReAuthResponse} from '../types/authReducer';


export const instanceAxios = axios.create({
    withCredentials: true,
    baseURL: API_URL,
});

instanceAxios.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
    return config;
});

instanceAxios.interceptors.response.use(
    (config) => {
        return config;
    }, 
    async (error) => {
        const originalRequest = error.config;
        if (error?.response?.status === 401 && error.config && !error.config._isRetry) {
            originalRequest._isRetry = true;
            try {
                const response = await axios.get<IReAuthResponse>(`${API_URL}/user/refresh/`, {
                    withCredentials: true
                });
                localStorage.setItem('accessToken', response.data.accessToken);
                return instanceAxios.request(originalRequest);
            } catch (error) {
                throw error;
            }
        }
        throw error;
    }
);
