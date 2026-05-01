import api from "./api.js";

export const submitIdeaApi = async (formData) => {
  try {
    const response = await api.post("/ideas", formData);
    return {
      success: true,
      idea: response.data?.idea || response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to submit idea. Please try again.",
    };
  }
};

export const getMyIdeasApi = async () => {
  try {
    const response = await api.get("/ideas/my");
    return {
      success: true,
      ideas: response.data?.ideas || response.data || [],
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to load ideas.",
      ideas: [],
    };
  }
};

export const getIdeaByIdApi = async (id) => {
  try {
    const response = await api.get(`/ideas/${id}`);
    return {
      success: true,
      idea: response.data?.idea || response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Idea not found.",
    };
  }
};