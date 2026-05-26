"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import useAuthStore from "@/store/authStore";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const useBookmarkStore = create(
  persist(
    (set, get) => ({
      // ── State ─────────────────────────────────────
      items: [],
      map: {},
      isLoading: false,

      // ── Load all bookmarks from backend ───────────
      fetchBookmarks: async () => {
        const token = useAuthStore.getState().accessToken;
        if (!token) return;

        set({ isLoading: true });

        try {
          const res = await fetch(`${API}/bookmarks/collections`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          const data = await res.json();

          if (res.ok) {
            const all = data.data || [];

            const flat = [];
            const map = {};

            all.forEach((collection) => {
              (collection.items || []).forEach((item) => {
                flat.push(item);
                map[item.itemId] = true;
              });
            });

            set({
              items: flat,
              map,
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error("Fetch bookmarks error:", error);
          set({ isLoading: false });
        }
      },

      // ── Toggle bookmark ───────────────────────────
      toggle: async ({
        itemId,
        itemType,
        collectionName = "Saved",
        collectionEmoji = "🔖",
        snapshot = {},
      }) => {
        const token = useAuthStore.getState().accessToken;
        if (!token) return;

        const { map } = get();
        const alreadyBookmarked = !!map[itemId];

        try {
          if (alreadyBookmarked) {
            // Remove bookmark
            await fetch(`${API}/bookmarks/${itemId}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            const newMap = { ...map };
            delete newMap[itemId];

            set((state) => ({
              map: newMap,
              items: state.items.filter((x) => x.itemId !== itemId),
            }));
          } else {
            // Add bookmark
            const res = await fetch(`${API}/bookmarks`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                itemId,
                itemType,
                collectionName,
                collectionEmoji,
                snapshot,
              }),
            });

            const data = await res.json();

            if (res.ok) {
              set((state) => ({
                map: {
                  ...state.map,
                  [itemId]: true,
                },
                items: [...state.items, data.data],
              }));
            }
          }
        } catch (error) {
          console.error("Bookmark toggle error:", error);
        }
      },

      // ── Clear on logout ───────────────────────────
      clearBookmarks: () => {
        set({
          items: [],
          map: {},
        });
      },
    }),
    {
      name: "bookmark-storage",
      partialize: (state) => ({
        items: state.items,
        map: state.map,
      }),
    }
  )
);

export default useBookmarkStore;