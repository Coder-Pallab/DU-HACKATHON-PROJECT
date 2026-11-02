import { apiClient } from "./apiClient";

export const careerService = {
  async list(params = {}) {
    const { data } = await apiClient.get("/careers", { params });
    return data.data;
  },

  async get(careerId) {
    const { data } = await apiClient.get(`/careers/${encodeURIComponent(careerId)}`);
    return data.data;
  },
};
