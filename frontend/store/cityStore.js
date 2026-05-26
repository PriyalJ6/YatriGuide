import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";

// ─────────────────────────────────────────────────────────────────────────────
// CITY STORE
// Now exported as BOTH named and default so both import styles work:
//   import useCityStore from "@/store/cityStore"          ← default (navbar etc)
//   import { useCityStore } from "@/store/cityStore"      ← named  (page.js)
// ─────────────────────────────────────────────────────────────────────────────

export const useCityStore = create(
  persist(
    (set, get) => ({

      // ── State ──────────────────────────────────────────────────────────────
      allCities: [],
      cities: [],           // alias — page.js reads `cities`
      selectedCity: null,
      isLoading: false,
      error: null,

      // ── Actions ────────────────────────────────────────────────────────────

      fetchCities: async () => {
        if (get().allCities.length > 0) return;

        set({ isLoading: true, error: null });
        try {
          const response = await api.get("/cities");
          const cities = response.data.data;

          set({ allCities: cities, cities, isLoading: false });

          if (!get().selectedCity && cities.length > 0) {
            set({ selectedCity: cities[0] });
          }
        } catch (error) {
          set({ error: "Failed to load cities", isLoading: false });
        }
      },

      setCity: (city) => set({ selectedCity: city }),

      fetchCityBySlug: async (slug) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get(`/cities/${slug}`);
          const city = response.data.data;
          set({ selectedCity: city, isLoading: false });
          return city;
        } catch (error) {
          set({ error: "City not found", isLoading: false });
          return null;
        }
      },

      clearSelectedCity: () => set({ selectedCity: null }),
    }),

    {
      name: "city-storage",
      partialize: (state) => ({
        selectedCity: state.selectedCity,
        allCities: state.allCities,
        cities: state.cities,
      }),
    }
  )
);

export default useCityStore;