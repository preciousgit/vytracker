import axios from 'axios';

// Create an Axios instance with a base URL
const axiosInstance = axios.create({
  baseURL: 'https://localhost:44308/api',
});

export default axiosInstance;
