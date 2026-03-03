import axios from 'axios';
import config from '../config';

const { baseUrl } = config.api;

export const apiClient = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalised = new Error(
      error?.response?.data?.error ||
        error?.message ||
        'Request failed'
    );
    normalised.status = error?.response?.status;
    normalised.data = error?.response?.data;
    throw normalised;
  }
);
