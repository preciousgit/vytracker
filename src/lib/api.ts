/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api.ts
import axios from "axios";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars*/
import { config } from "process";

const API_BASE_URL = "http://localhost:4992/api"; // Change this to your API

// Function to get auth token from storage
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAuthToken = () => {
  // Check if we're in a browser environment before accessing localStorage
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Create axios instance without the token initially
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
export const getRequest = async (url: string, data: any) => {
  return axios.get(`${API_BASE_URL}${url}`, data);
};

export const putRequest = async (url: string, data: any, config?: any) => {
  return axios.put(`${API_BASE_URL}${url}`, data, config);
};

export const deleteRequest = async (url: string, data: any) => {
  return axios.delete(`${API_BASE_URL}${url}`, data);
};

export const postRequest = async (url: string, data: any, config?: any) => {
    return axios.post(`${API_BASE_URL}${url}`, data, config);
  };
