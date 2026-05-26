"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import useCityStore from "@/store/cityStore";

// ─────────────────────────────────────────────────────────────────────────────
// AUTH PROVIDER
//
// This runs ONCE when the app first loads.
// It does two things silently in the background:
//
// 1. checkAuth()
//    Verifies if the stored JWT token is still valid.
//    If user had logged in before and refreshed the page,
//    this confirms they're still authenticated.
//    If token expired → clears store → user sees Login button in navbar.
//
// 2. fetchCities()
//    Loads all cities once on app start.
//    Every page that needs cities (navbar dropdown, city selector)
//    will instantly have them from the store — no loading needed.
//
// Why useEffect?
// These are API calls — they can't run on the server.
// useEffect only runs in the browser, after the page renders.
// ─────────────────────────────────────────────────────────────────────────────

export default function AuthProvider({ children }) {
  const { checkAuth } = useAuthStore();
  const { fetchCities } = useCityStore();

  useEffect(() => {
    // Run both simultaneously — no need to wait for one before the other
    checkAuth();
    fetchCities();
  }, []); // Empty array = runs only once when app loads

  // This component is invisible — it just runs logic and renders children
  return <>{children}</>;
}
