import { apiClient } from "./apiClient";

const getData = (response) => response.data.data;

export const studentService = {
  async getProfile() {
    return getData(await apiClient.get("/students/me"));
  },

  async createPlacementReadinessAssessment(careerId) {
    return getData(
      await apiClient.post("/students/me/readiness", { careerId })
    );
  },

  async getPlacementReadinessAssessment(careerId) {
    return getData(
      await apiClient.get(`/students/me/readiness/${encodeURIComponent(careerId)}`, {
        suppressErrorToast: true,
      })
    );
  },

  async updateProfile(payload) {
    return getData(await apiClient.patch("/students/profile", payload));
  },

  async updateAcademicDetails(payload) {
    return getData(await apiClient.patch("/students/academic-details", payload));
  },

  async updateInterests(payload) {
    return getData(await apiClient.patch("/students/interests", payload));
  },

  async updatePreferences(payload) {
    return getData(await apiClient.patch("/students/preferences", payload));
  },

  async getSkills() {
    return getData(await apiClient.get("/students/me/skills"));
  },

  async addSkill(payload) {
    return getData(await apiClient.post("/students/me/skills", payload));
  },

  async updateSkill(skillId, payload) {
    return getData(await apiClient.patch(`/students/me/skills/${encodeURIComponent(skillId)}`, payload));
  },

  async deleteSkill(skillId) {
    return getData(await apiClient.delete(`/students/me/skills/${encodeURIComponent(skillId)}`));
  },
};
