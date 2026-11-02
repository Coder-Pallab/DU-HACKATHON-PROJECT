import { apiClient } from "./apiClient";

const getData = (response) => response.data.data;

export const aiService = {
  async extractSkills(payload) {
    return getData(await apiClient.post("/ai/skills/extract", payload));
  },

  async classifySkills(skills) {
    return getData(await apiClient.post("/ai/skills/classify", { skills }));
  },

  async getRecommendations() {
    return getData(await apiClient.get("/students/me/recommendations"));
  },

  async refreshRecommendations() {
    return getData(await apiClient.post("/students/me/recommendations/refresh"));
  },

  async analyzeSkillGap(careerId) {
    return getData(await apiClient.post("/ai/skill-gap/analyze", { careerId }));
  },

  async getSkillGap(careerId) {
    return getData(await apiClient.get(`/ai/skill-gap/${encodeURIComponent(careerId)}`));
  },

  async generateRoadmap(careerId) {
    return getData(await apiClient.post("/ai/roadmaps/generate", { careerId }));
  },

  async getRoadmap(careerId) {
    return getData(await apiClient.get(`/ai/roadmaps/${encodeURIComponent(careerId)}`));
  },

  async listRoadmaps() {
    return getData(await apiClient.get("/ai/roadmaps"));
  },

  async updateRoadmapPhase(roadmapId, phaseId, status) {
    return getData(
      await apiClient.patch(
        `/ai/roadmaps/${encodeURIComponent(roadmapId)}/phases/${encodeURIComponent(phaseId)}`,
        { status }
      )
    );
  },

  async listConversations(params = {}) {
    const { data } = await apiClient.get("/ai/chat/conversations", { params });
    return data.data.items;
  },

  async getConversation(conversationId) {
    return getData(
      await apiClient.get(`/ai/chat/conversations/${encodeURIComponent(conversationId)}`)
    );
  },

  async sendMessage(payload) {
    return getData(await apiClient.post("/ai/chat/messages", payload));
  },
};
