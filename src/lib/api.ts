/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:4992/api";

// Function to get auth token from storage
const getAuthToken = () => {
  // Check if we're in a browser environment before accessing localStorage
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Modify request functions to use the intercepted api instance
export const getRequest = async (url: string, data?: any) => {
  return api.get(url, { params: data }); // Use params for query parameters
};

export const putRequest = async (url: string, data: any, config?: any) => {
  return api.put(url, data, config);
};

export const deleteRequest = async (url: string, data: any) => {
  return api.delete(url, data);
};

export const postRequest = async (url: string, data: any, config?: any) => {
  return api.post(url, data, config);
};