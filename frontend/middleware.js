import { NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// MIDDLEWARE
//
// This file is special in Next.js — it runs on the SERVER before ANY page loads.
// The user never sees the page even for a millisecond before this runs.
//
// What it does:
// 1. Checks if the route being visited is a protected route
// 2. If yes → checks if accessToken exists in cookies
// 3. No token → redirects to /auth/login with the original URL as a parameter
//    so after login, user is sent back to where they wanted to go
// 4. Has token → lets the page load normally
//
// NOTE: This only checks if token EXISTS, not if it's valid.
// The actual token validation happens in:
// → AuthProvider (checkAuth on app load)
// → Your backend (verifyJWT middleware on protected API calls)
// Middleware just does a quick existence check for instant redirects.
// ─────────────────────────────────────────────────────────────────────────────

// ── Protected routes ─────────────────────────────────────────────────────────
// These routes require the user to be logged in.
// Any route starting with these paths will be protected.
const PROTECTED_ROUTES = [
  "/bookmarks",
  "/notes",
  "/profile",
  "/savedTrip",
];

// ── Auth routes ──────────────────────────────────────────────────────────────
// If user is already logged in and visits /auth/login or /auth/register,
// redirect them to home — no point showing login to logged-in user
const AUTH_ROUTES = [
  "/auth/login",
  "/auth/register",
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get token from cookies
  // Your backend sets 'accessToken' as an httpOnly cookie on login
  const token = request.cookies.get("accessToken")?.value;

  // ── Check if current path is a protected route ────────────────────────────
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // ── Check if current path is an auth route ────────────────────────────────
  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // ── Case 1: Protected route + no token → redirect to login ───────────────
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/auth/login", request.url);

    // Save where user was trying to go
    // After login, we'll redirect them back here
    // Example: /auth/login?redirect=/bookmarks
    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // ── Case 2: Auth route + has token → redirect to home ────────────────────
  // Logged-in user shouldn't see login/register page
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ── Case 3: Everything else → let it through ─────────────────────────────
  return NextResponse.next();
}

// ── Matcher config ───────────────────────────────────────────────────────────
// Tells Next.js WHICH routes this middleware should run on.
// Without this, middleware runs on EVERY request including images, CSS, API.
// We exclude static files and Next.js internals for performance.
export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - _next/static  (Next.js static files)
     * - _next/image   (Next.js image optimization)
     * - favicon.ico   (browser favicon)
     * - public files  (images, fonts etc in /public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|.*\\..*).*)"],
};