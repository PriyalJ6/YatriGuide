import api from "@/lib/axios";

export const transportService = {
  getAll: async (params = {}) => {
    const cleaned = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== "" && v != null)
    );
    const { data } = await api.get("/transports", { params: cleaned });   // ← s
    return data?.data || [];
  },
  getByCity: async (city, params = {}) =>
    transportService.getAll({ ...params, city }),
  getBySlug: async (city, slug) => {
    const { data } = await api.get(`/transports/${city}/${slug}`);        // ← s
    return data?.data;
  },
};

export const getTransportImage = (t) =>
  t?.heroImage || t?.images?.[0]?.url || t?.images?.[0] ||
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80";

export default transportService;