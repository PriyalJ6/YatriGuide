import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import AuthProvider from "@/providers/AuthProvider";
import Navbar from "@/components/layout/navbar.jsx";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Travel Guide",
  description: "Discover the best places, restaurants and hotels near you",
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOT LAYOUT
//
// This wraps your ENTIRE app. Every page goes through here.
//
// Provider order matters — outer to inner:
// QueryProvider  → gives React Query access to whole app
// AuthProvider   → checks if user is still logged in on every page load
//                  (calls checkAuth() once when app starts)
//
// Think of it like layers:
// QueryProvider
//   └── AuthProvider
//         └── your pages
// ─────────────────────────────────────────────────────────────────────────────

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
