import api from "@/lib/axios";

export const hotelService = {
  getAll: async (params = {}) => {
    const { data } = await api.get("/hotels", { params });
    return data?.data;
  },
  getByCity: async (city, params = {}) => {
    const { data } = await api.get("/hotels", { params: { ...params, city } });
    return data?.data?.hotels || [];
  },
  getBySlug: async (city, slug) => {
    const { data } = await api.get(`/hotels/${city}/${slug}`);
    return data?.data;
  },
};

export const getHotelImage = (h) =>
  h?.heroImage || h?.images?.[0]?.url || h?.images?.[0] ||
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80";