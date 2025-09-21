// Utility for API configuration

export const getApiBaseUrl = (): string => {
  // First check for explicit environment variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Development mode detection
  if (import.meta.env.DEV || 
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000/api';
  }
  
  // Production mode - use relative path which will be routed to backend by Vercel
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();

// Enhanced fetch wrapper with better error handling
export const apiFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  const defaultOptions: RequestInit = {
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  console.log(`API call: ${options.method || 'GET'} ${fullUrl}`);
  
  try {
    const response = await fetch(fullUrl, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error(`API call failed for ${fullUrl}:`, error);
    throw error;
  }
};

// Environment info for debugging
export const getEnvironmentInfo = () => {
  return {
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
    prod: import.meta.env.PROD,
    hostname: window.location.hostname,
    apiBaseUrl: API_BASE_URL,
    customApiUrl: import.meta.env.VITE_API_BASE_URL,
  };
};