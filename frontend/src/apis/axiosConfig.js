import axios from 'axios';

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; 


const isViteDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;
const isLocalHostName = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1|\[::1\]|::1)$/.test(window.location.hostname);


let resolvedBase = (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : 'https://ai-content-generator-backend-qfqj.onrender.com';

if (!isViteDev && !isLocalHostName && /^https?:\/\/(localhost|127\.0\.0\.1)/.test(resolvedBase)) {
  
  console.warn('Overriding invalid production API base URL pointing to localhost:', resolvedBase);
  resolvedBase = 'https://ai-content-generator-backend-qfqj.onrender.com';
}

const API_BASE_URL = isViteDev
  ? '' 
  : resolvedBase; 


const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000, 
});


api.interceptors.response.use(undefined, async (err) => {
  const { config } = err;
  if (!config || !config.retry) {
    config.retry = 0;
  }

  const status = err.response?.status;
  
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
    
    try {
      console.error('API error (final)', {
        url: (config.baseURL || '') + (config.url || ''),
        method: config.method,
        status: err.response?.status,
        data: err.response?.data,
      });
    } catch (_) {}
    
    if (err.code === 'ECONNREFUSED' || !err.response) {
      throw new Error('Unable to reach the server. Please check if the backend is running.');
    }
    throw err;
  }

  config.retry += 1;

  
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
