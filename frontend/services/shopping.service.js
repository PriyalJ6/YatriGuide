import api from "@/lib/axios";

export const shoppingService = {
  getAll: async (params = {}) => {
    const cleaned = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== "" && v != null)
    );
    const { data } = await api.get("/shopping", { params: cleaned });
    return data?.data; // { markets, pagination }
  },
  getByCity: async (city, params = {}) => {
    const { data } = await api.get("/shopping", { params: { ...params, city } });
    return data?.data?.markets || [];
  },
  getBySlug: async (city, slug) => {
    const { data } = await api.get(`/shopping/${city}/${slug}`);
    return data?.data;
  },
};

export const getShoppingImage = (m) =>
  m?.heroImage || m?.images?.[0]?.url || m?.images?.[0] ||
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80";

export default shoppingService;