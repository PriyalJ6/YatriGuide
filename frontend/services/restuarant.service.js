import api from "@/lib/axios";

export const restaurantService = {
  getAll: async (params = {}) => {
    const { data } = await api.get("/restaurants", { params });
    return data?.data;
  },
  getByCity: async (city, params = {}) => {
    const { data } = await api.get("/restaurants", { params: { ...params, city } });
    return data?.data?.restaurants || [];
  },
  getBySlug: async (city, slug) => {
    const { data } = await api.get(`/restaurants/${city}/${slug}`);
    return data?.data;
  },
};

export const getRestaurantImage = (r) =>
  r?.heroImage || r?.images?.[0]?.url || r?.images?.[0] ||
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80";