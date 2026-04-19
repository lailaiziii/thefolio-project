// frontend/src/api/axios.js
import axios from 'axios';

const LOCAL_API_URL = 'http://localhost:5000/api';
const DEPLOYED_API_URL = 'https://thefolio-api.onrender.com/api';

const normalizeApiUrl = (url) => url.replace(/\/+$/, '');

const getPreferredApiUrl = () => {
  const configuredUrl = process.env.REACT_APP_API_URL?.trim();
  if (configuredUrl) return normalizeApiUrl(configuredUrl);

  if (window.location.hostname === 'localhost') {
    return LOCAL_API_URL;
  }

  return DEPLOYED_API_URL;
};

const getFallbackApiUrl = (currentBaseUrl) => {
  const normalized = normalizeApiUrl(currentBaseUrl || '');
  if (normalized === LOCAL_API_URL) return DEPLOYED_API_URL;
  if (normalized === DEPLOYED_API_URL) return LOCAL_API_URL;
  return DEPLOYED_API_URL;
};

export const getApiBaseUrl = () => normalizeApiUrl(instance.defaults.baseURL || getPreferredApiUrl());

export const getUploadsBaseUrl = () => getApiBaseUrl().replace(/\/api$/, '');

const instance = axios.create({
  baseURL: getPreferredApiUrl(),
  timeout: 10000,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (!config || config._retryWithFallback) {
      return Promise.reject(error);
    }

    const isNetworkFailure =
      error.message === 'Network Error' ||
      error.code === 'ECONNABORTED' ||
      !error.response;

    if (!isNetworkFailure) {
      return Promise.reject(error);
    }

    config._retryWithFallback = true;
    const fallbackBaseUrl = getFallbackApiUrl(config.baseURL || instance.defaults.baseURL);

    if (fallbackBaseUrl === (config.baseURL || instance.defaults.baseURL)) {
      return Promise.reject(error);
    }

    instance.defaults.baseURL = fallbackBaseUrl;
    config.baseURL = fallbackBaseUrl;

    return instance(config);
  }
);

export default instance;
