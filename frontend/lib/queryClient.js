import { QueryClient } from "@tanstack/react-query";

// ─────────────────────────────────────────────────────────────────────────────
// QUERY CLIENT
//
// This is the brain of React Query — it controls:
// 1. How long data stays "fresh" (staleTime)
//    Fresh = don't refetch even if component re-renders
// 2. How long unused data stays in cache (gcTime)
//    After this, data is garbage collected from memory
// 3. How many times to retry a failed request (retry)
// 4. Whether to refetch when user switches browser tabs (refetchOnWindowFocus)
//
// These are DEFAULT settings for your whole app.
// You can override them per-query if needed.
// ─────────────────────────────────────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // How long data is considered "fresh" — 5 minutes
      // During this time, React Query won't refetch even if
      // the component unmounts and remounts (e.g. user navigates away and back)
      // Perfect for your app — cities, places don't change every second
      staleTime: 1000 * 60 * 5, // 5 minutes

      // How long UNUSED data stays in cache — 10 minutes
      // "Unused" = no component is currently subscribed to it
      // After 10 mins of no use, it gets cleared from memory
      gcTime: 1000 * 60 * 10, // 10 minutes

      // Retry failed requests 1 time before showing error
      // Don't retry too many times — if backend is down, fail fast
      retry: 1,

      // Don't refetch when user switches tabs and comes back
      // Prevents unnecessary API calls when user alt-tabs
      refetchOnWindowFocus: false,

      // Don't refetch when internet reconnects
      // Your data isn't real-time so this isn't needed
      refetchOnReconnect: false,
    },

    mutations: {
      // Don't retry mutations (POST, PUT, DELETE) on failure
      // If a bookmark save fails, don't silently retry — show the error
      retry: 0,
    },
  },
});

export default queryClient;