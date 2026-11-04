import { apiClient } from "./apiClient";

const getData = (response) => response.data.data;

export const resumeService = {
  async list() {
    const data = getData(await apiClient.get("/resumes"));
    return data.items;
  },

  async upload(file) {
    const formData = new FormData();
    formData.append("resume", file);
    return getData(await apiClient.post("/resumes/upload", formData));
  },

  async parse(resumeId) {
    return getData(await apiClient.post(`/resumes/${encodeURIComponent(resumeId)}/parse`));
  },

  async analyze(resumeId) {
    return getData(await apiClient.post(`/resumes/${encodeURIComponent(resumeId)}/analyze`));
  },

  async analyzeIntelligence(resumeId, careerId) {
    return getData(
      await apiClient.post(
        `/resumes/${encodeURIComponent(resumeId)}/intelligence/analyze`,
        careerId ? { careerId } : {},
        { timeout: 100_000 }
      )
    );
  },

  async listIntelligenceAnalyses(resumeId) {
    return getData(
      await apiClient.get(
        `/resumes/${encodeURIComponent(resumeId)}/intelligence/analyses`
      )
    );
  },

  async compareCompatibility(resumeId, payload) {
    return getData(
      await apiClient.post(
        `/resumes/${encodeURIComponent(resumeId)}/intelligence/compatibility`,
        payload
      )
    );
  },

  async createImprovementDraft(resumeId, analysisId, payload) {
    return getData(
      await apiClient.post(
        `/resumes/${encodeURIComponent(resumeId)}/intelligence/analyses/${encodeURIComponent(analysisId)}/improvements`,
        payload,
        { timeout: 100_000 }
      )
    );
  },

  async updateImprovementDraft(resumeId, analysisId, draftId, payload) {
    return getData(
      await apiClient.patch(
        `/resumes/${encodeURIComponent(resumeId)}/intelligence/analyses/${encodeURIComponent(analysisId)}/improvements/${encodeURIComponent(draftId)}`,
        payload
      )
    );
  },

  async download(resumeId) {
    const response = await apiClient.get(
      `/resumes/${encodeURIComponent(resumeId)}/download`,
      { responseType: "blob" }
    );
    return response.data;
  },

  async remove(resumeId) {
    return getData(await apiClient.delete(`/resumes/${encodeURIComponent(resumeId)}`));
  },
};
