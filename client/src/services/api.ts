import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';

const baseURL = process.env.REACT_APP_REST_API_URL;
// const baseURL = `http://127.0.0.1:8000/api/`;

let accessToken = localStorage.getItem('access') || '';
let refreshToken = localStorage.getItem('refresh') || '';

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
});

api.interceptors.request.use(
    async (req) => {
        if (!accessToken) {
            accessToken = localStorage.getItem('access') || '';
            refreshToken = localStorage.getItem('refresh') || '';
        }

        if (accessToken) {
            const user: any = jwtDecode(accessToken);
            const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

            if (!isExpired) {
                req.headers.Authorization = `Bearer ${accessToken}`;
                return req;
            }

            try {
                const response = await axios.post(`${baseURL}token/refresh/`, {
                    refresh: refreshToken,
                });

                accessToken = response.data.access;
                localStorage.setItem('access', accessToken);
                req.headers.Authorization = `Bearer ${accessToken}`;
            } catch (error) {
                console.error('Token refresh failed:', error);
                try {
                    axios.post(`${baseURL}logout/`, {
                        refresh: refreshToken,
                    }).then(
                        (res) => {
                            console.log(res);
                        },
                        (err) => {
                            console.log(err);
                        }
                    );
                    
                } catch (error) {
                    console.error('Logout failed:', error);
                }
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                localStorage.clear();
                window.location.href = '/auth/signin';
                return Promise.reject(error);
            }
        }

        return req;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;