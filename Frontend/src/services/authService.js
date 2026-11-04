import { apiClient } from "./apiClient";

export const authService = {
  async register({ name, email, password, phone }) {
    const { data } = await apiClient.post("/auth/register", {
      name,
      email,
      password,
      ...(phone ? { phone } : {}),
    });
    return data.data;
  },

  async login(credentials) {
    const { data } = await apiClient.post("/auth/login", credentials);
    return data.data;
  },

  async getCurrentUser() {
    const { data } = await apiClient.get("/auth/me");
    return data.data.user;
  },

  async logout() {
    await apiClient.post("/auth/logout");
  },

  async forgotPassword(email) {
    const { data } = await apiClient.post("/auth/forgot-password", { email });
    return data;
  },

  async resetPassword(token, newPassword) {
    const { data } = await apiClient.post("/auth/reset-password", {
      token,
      newPassword,
    });
    return data;
  },

  async changePassword(currentPassword, newPassword) {
    const { data } = await apiClient.patch("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return data;
  },
};
