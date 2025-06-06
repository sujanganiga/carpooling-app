import axios from "axios";

// Add trailing slash to ensure consistent URL concatenation
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Add withCredentials if using cookies for auth
  withCredentials: true,
});

// Enhanced request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Only add auth header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Ensure URLs are properly constructed
    if (config.url) {
      // Remove duplicate slashes that might occur from baseURL
      config.url = config.url.replace(/([^:]\/)\/+/g, "$1");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
api.interceptors.response.use(
  (response) => {
    // You can modify successful responses here if needed
    return response;
  },
  (error) => {
    // Handle network errors (server down, etc.)
    if (!error.response) {
      console.error("Network Error:", error.message);
      return Promise.reject({
        response: {
          data: {
            message: "Network Error - Please check your connection",
          },
        },
      });
    }

    // Handle specific status codes
    switch (error.response.status) {
      case 401: // Unauthorized
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        break;
      case 404: // Not Found
        console.error("Endpoint not found:", error.config.url);
        break;
      case 500: // Server Error
        console.error("Server Error:", error.response.data);
        break;
      default:
        console.error("Unhandled Error:", error);
    }

    return Promise.reject(error);
  }
);

export default api;
