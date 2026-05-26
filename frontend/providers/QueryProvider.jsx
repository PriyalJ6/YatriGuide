"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import queryClient from "@/lib/queryClient";

// ─────────────────────────────────────────────────────────────────────────────
// QUERY PROVIDER
//
// This wraps your entire app and gives EVERY component access to React Query.
// Without this wrapper, no component can use useQuery or useMutation.
//
// Why a separate file and not directly in layout.js?
// Because layout.js is a Server Component in Next.js App Router.
// QueryClientProvider needs "use client" — you can't mix them.
// So we create this separate Client Component and import it in layout.js.
//
// ReactQueryDevtools:
// Shows a floating panel (bottom of screen) in development only.
// You can see all your queries, their cache status, data, errors.
// Automatically hidden in production build — no extra code needed.
// ─────────────────────────────────────────────────────────────────────────────

export default function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools only shows in development, hidden automatically in production */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
