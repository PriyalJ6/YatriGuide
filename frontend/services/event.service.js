import api from "@/lib/axios";

export const eventService = {
  getAll: async (params = {}) => {
    const { data } = await api.get("/events", { params });
    return data?.data;
  },
  getByCity: async (city, params = {}) => {
    const { data } = await api.get("/events", { params: { ...params, city } });
    return data?.data?.events || [];
  },
  getFeatured: async (params = {}) => {
    const { data } = await api.get("/events/featured", { params });
    return data?.data || [];
  },
  getBySlug: async (city, slug) => {
    const { data } = await api.get(`/events/${city}/${slug}`);
    return data?.data;
  },
};

export const getEventImage = (e) =>
  e?.heroImage || e?.images?.[0] ||
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80";