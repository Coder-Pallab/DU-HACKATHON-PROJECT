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
