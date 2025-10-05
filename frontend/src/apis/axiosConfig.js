// axiosConfig.js
import axios from 'axios';

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

// Determine API base URL from env or default
const DEFAULT_BASE_URL = 'http://localhost:3000';
const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || DEFAULT_BASE_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000, // 10 seconds
});

// Add retry logic with safeguards: do NOT retry on 401/403 or other 4xx
api.interceptors.response.use(undefined, async (err) => {
  const { config } = err;
  if (!config || !config.retry) {
    config.retry = 0;
  }

  const status = err.response?.status;
  // Do not retry on auth errors or other client errors
  if (status === 401 || status === 403 || (status && status < 500)) {
    try {
      console.error('API error (no-retry)', {
        url: (config.baseURL || '') + (config.url || ''),
        method: config.method,
        status,
        data: err.response?.data,
      });
    } catch (_) {}
    throw err;
  }

  if (config.retry >= MAX_RETRIES) {
    // Log final error details for easier debugging
    try {
      console.error('API error (final)', {
        url: (config.baseURL || '') + (config.url || ''),
        method: config.method,
        status: err.response?.status,
        data: err.response?.data,
      });
    } catch (_) {}
    // If we've retried maximum times, throw the error
    if (err.code === 'ECONNREFUSED' || !err.response) {
      throw new Error('Unable to reach the server. Please check if the backend is running.');
    }
    throw err;
  }

  config.retry += 1;

  // Create new promise to handle retry
  const backoff = new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Retrying request (${config.retry}/${MAX_RETRIES}) to ${config.baseURL || API_BASE_URL}${config.url}`);
      resolve();
    }, RETRY_DELAY * config.retry);
  });

  await backoff;
  return api(config);
});

export default api;