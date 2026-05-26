import axios from "axios";

// ─────────────────────────────────────────────────────────────────────────────
// BASE INSTANCE
// This is the single axios instance your whole app uses.
// It already knows your backend URL and attaches the token automatically.
// ─────────────────────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // http://localhost:8000/api/v1
  withCredentials: true,                    // sends cookies (accessToken, refreshToken) automatically
  headers: {
    "Content-Type": "application/json",
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// REQUEST INTERCEPTOR
// Runs before EVERY request is sent.
// Grabs the accessToken from localStorage and attaches it as a Bearer token.
// Your backend middleware reads: req.header("Authorization")?.replace("Bearer ","")
// ─────────────────────────────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Only runs in browser (not during Next.js server-side rendering)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSE INTERCEPTOR
// Runs after EVERY response comes back.
//
// SUCCESS (2xx): just returns the response data directly
//
// ERROR:
//   - If 401 (token expired) → calls /auth/refresh-token to get a new token
//   - Saves the new token to localStorage
//   - Automatically retries the original failed request with the new token
//   - If refresh also fails → clears everything and redirects to /login
// ─────────────────────────────────────────────────────────────────────────────
let isRefreshing = false;           // prevents multiple refresh calls at once
let failedRequestsQueue = [];       // stores requests that failed while refreshing

api.interceptors.response.use(
  // ── Success: just pass through ──
  (response) => response,

  // ── Error handler ──
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 errors that haven't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If already refreshing, queue this request to retry after refresh
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // Mark this request as retried so we don't loop infinitely
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call your backend's refresh token endpoint
        // Your backend: POST /api/v1/auth/refresh-token
        // It reads refreshToken from cookies (withCredentials: true handles this)
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        // Your backend response: { data: { accessToken, refreshToken } }
        const newAccessToken = response.data?.data?.accessToken;

        // Save new token to localStorage
        localStorage.setItem("accessToken", newAccessToken);

        // Update the Authorization header for future requests
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry all queued requests with the new token
        failedRequestsQueue.forEach(({ resolve }) => resolve(newAccessToken));
        failedRequestsQueue = [];

        // Retry the original failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // Refresh token also failed → user must log in again
        failedRequestsQueue.forEach(({ reject }) => reject(refreshError));
        failedRequestsQueue = [];

        // Clear all stored auth data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        // Redirect to login page
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For all other errors (400, 403, 404, 500 etc.), just reject normally
    return Promise.reject(error);
  }
);

export default api;