import api from "@/lib/axios";

export const agencyService = {
  getAll: async (params = {}) => {
    const { data } = await api.get("/agencies", { params });
    return data?.data; // { agencies, pagination }
  },
  getByCity: async (city, params = {}) => {
    // backend filters server-side via citySlugs match
    const { data } = await api.get("/agencies", { params: { ...params, city } });
    return data?.data?.agencies || [];
  },
  getBySlug: async (slug) => {
    const { data } = await api.get(`/agencies/${slug}`);
    return data?.data;
  },
};

export const getAgencyImage = (a) =>
  a?.heroImage || a?.logo || a?.images?.[0] ||
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80";