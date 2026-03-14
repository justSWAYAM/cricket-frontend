// src/services/api.js

// 1. Determine the Base URL based on environment
import { getApiBaseUrl } from '../config';

// Use backticks (`) to ensure the function executes as a fallback
// This will use your AWS IP in production or localhost in development
const API_BASE_URL = import.meta.env.PROD 
  ? "/api" 
  : (import.meta.env.VITE_API_URL || getApiBaseUrl());

/**
 * Custom fetch wrapper to handle Base URL and Security Headers
 */
export const apiFetch = async (endpoint, options = {}) => {
  // Ensure endpoint starts with a slash
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // 2. Get the Admin Key from storage (for protected routes)
  const adminKey = localStorage.getItem('admin_key');

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // 3. Automatically add the security header if the key exists
  if (adminKey) {
    defaultHeaders['x-admin-key'] = adminKey;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  // Handle common security errors
  if (response.status === 403) {
    console.error("Security Block: Invalid or missing Admin Key.");
  }

  return response;
};
