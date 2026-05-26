import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "@/services/auth.service";

const useAuthStore = create(
  persist(
    (set, get) => ({

      // ── State ──────────────────────────────────────────────────────────────
      user: null,
      accessToken: null,
      isLoggedIn: false,
      isLoading: false,

      // ── register() ──
      // Called from Register page. Calls POST /api/v1/auth/register
      // On success: returns { success: true, user }
      // On failure: returns { success: false, message } — form displays the error
      register: async ({ fullName, username, email, password }) => {
        set({ isLoading: true });
        try {
          const { user } = await registerUser({ fullName, username, email, password });
          set({ isLoading: false });
          return { success: true, user };
        } catch (error) {
          set({ isLoading: false });
          const message =
            error.response?.data?.message || "Registration failed. Please try again.";
          return { success: false, message };
        }
      },

      // ── login() ──
      login: async ({ email, password }) => {
        set({ isLoading: true });
        try {
          const { user, accessToken } = await loginUser({ email, password });
          set({ user, accessToken, isLoggedIn: true, isLoading: false });
          return { success: true, user };
        } catch (error) {
          set({ isLoading: false });
          const message =
            error.response?.data?.message || "Login failed. Please try again.";
          return { success: false, message };
        }
      },

      // ── logout() ──
      logout: async () => {
        set({ isLoading: true });
        try {
          await logoutUser();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set({ user: null, accessToken: null, isLoggedIn: false, isLoading: false });
        }
      },

      // ── checkAuth() ──
      checkAuth: async () => {
        const { isLoggedIn } = get();
        if (!isLoggedIn) return;
        set({ isLoading: true });
        try {
          const user = await getCurrentUser();
          set({ user, isLoggedIn: true, isLoading: false });
        } catch (error) {
          set({ user: null, accessToken: null, isLoggedIn: false, isLoading: false });
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
        }
      },

      // ── updateUser() ──
      updateUser: (updatedUser) => set({ user: updatedUser }),
    }),

    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

export default useAuthStore;