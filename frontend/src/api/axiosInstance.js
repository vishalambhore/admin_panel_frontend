// import axios from 'axios';

// const axiosInstance = axios.create({
//     baseURL: 'http://localhost:5000/api',  
// });

// axiosInstance.interceptors.request.use((config) => {
//     // 👇 adminToken (admin login) OR userToken (normal user login)
//     const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// export default axiosInstance;





import axios from 'axios';
const axiosInstance = axios.create({
    baseURL: 'http://192.168.1.3:5000/api',
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


const pythonApi = axios.create({
    baseURL: 'http://192.168.1.11:8000/api',
});


export const pythonGet = (endpoint, params = {}) => pythonApi.get(endpoint, { params });
export const pythonPost = (endpoint, data) => pythonApi.post(endpoint, data);
export const pythonPut = (endpoint, data) => pythonApi.put(endpoint, data);
export const pythonDelete = (endpoint) => pythonApi.delete(endpoint);

export default axiosInstance;      // Node (default)
export { pythonApi };              // Python client as named export