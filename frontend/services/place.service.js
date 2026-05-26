import api from "@/lib/axios";

export const placeService = {
  getAll: async (params = {}) => {
    const cleaned = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
    );
    const { data } = await api.get("/places", { params: cleaned });
    return data?.data;
  },
  getByCity: async (city, params = {}) => {
    const { data } = await api.get("/places", { params: { ...params, city } });
    return data?.data?.places || [];
  },
  getBySlug: async (city, slug) => {
    const { data } = await api.get(`/places/${city}/${slug}`);
    return data?.data;
  },
  getNearby: async (city, slug) => {
    try {
      const { data } = await api.get(`/cities/places/${city}/${slug}/nearby`);
      return data?.data?.places || [];
    } catch { return []; }
  },
  getFeatured: async (limit = 8) => {
    try {
      const { data } = await api.get("/places", {
        params: { featured: true, limit }
      });
      return data?.data?.places || [];
    } catch { return []; }
  },
};

export const getPlaceImage = (p) =>
  p?.heroImage || p?.images?.[0]?.url || p?.images?.[0] ||
  "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80";