import api from "@/lib/axios";

// ─────────────────────────────────────────────────────────────────────────────
// AUTH SERVICE
// Every auth-related API call lives here.
// Components never write axios calls directly — they call these functions.
//
// Your backend response shape (from ApiResponse utility):
// { statusCode, data, message, success }
// So actual data is always at: response.data.data
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/v1/auth/register
// Body: { fullName, username, email, password }
// Returns: { user }
export const registerUser = async ({ fullName, username, email, password }) => {
  const response = await api.post("/auth/register", {
    fullName,
    username,
    email,
    password,
  });
  return response.data.data; // { user }
};

// POST /api/v1/auth/login
// Body: { email, password }
// Returns: { user, accessToken, refreshToken }
// Also saves tokens to localStorage so the request interceptor can use them
export const loginUser = async ({ email, password }) => {
  const response = await api.post("/auth/login", { email, password });

  const { user, accessToken, refreshToken } = response.data.data;

  // Save tokens — the request interceptor will pick these up automatically
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("user", JSON.stringify(user));

  return { user, accessToken, refreshToken };
};

// POST /api/v1/auth/logout  [protected]
// Clears cookies on backend, clears localStorage on frontend
export const logoutUser = async () => {
  await api.post("/auth/logout");

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

// GET /api/v1/auth/current-user  [protected]
// Returns the currently logged-in user from backend
export const getCurrentUser = async () => {
  const response = await api.get("/auth/current-user");
  return response.data.data; // returns the user object directly
};

// POST /api/v1/auth/forgot-password
// Body: { email }
// Returns: { resetUrl } (in dev — in prod you'd email this)
export const forgotPassword = async ({ email }) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data.data; // { resetUrl }
};

// POST /api/v1/auth/reset-password/:resetToken
// Body: { newPassword }
export const resetPassword = async ({ resetToken, newPassword }) => {
  const response = await api.post(`/auth/reset-password/${resetToken}`, {
    newPassword,
  });
  return response.data; // { message }
};

// POST /api/v1/auth/change-password  [protected]
// Body: { oldPassword, newPassword }
export const changePassword = async ({ oldPassword, newPassword }) => {
  const response = await api.post("/auth/change-password", {
    oldPassword,
    newPassword,
  });
  return response.data;
};