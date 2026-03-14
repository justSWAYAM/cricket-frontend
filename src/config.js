// src/config.js

export const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || `http://3.108.62.16:5001`; 
  }
  return `http://localhost:5001`;
};

// DOUBLE CHECK THIS PART: Ensure the 'export' is there
export const getAdminHeaders = () => {
  const adminKey = localStorage.getItem("admin_key") || "cricket2026admin";
  return {
    "Content-Type": "application/json",
    "x-admin-key": adminKey
  };
};
