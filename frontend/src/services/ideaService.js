import api from "./api.js";
import { mockIdeas } from "../data/mockIdeas.js";

const IDEAS_KEY = "visionflow_ideas";

const normalizeIdea = (idea) => ({
  id: idea.id || idea._id || `idea-${Date.now()}`,
  title: idea.title || "Untitled Idea",
  category: idea.category || "Other",
  problemStatement: idea.problemStatement || "",
  proposedSolution: idea.proposedSolution || "",
  targetUsers: idea.targetUsers || "General Users",
  budget: idea.budget || "Not specified",
  timeline: idea.timeline || "Not specified",
  description: idea.description || idea.problemStatement || "",
  status: idea.status || "pending",
  feasibilityScore: idea.feasibilityScore ?? 0,
  riskLevel: idea.riskLevel || "Pending",
  duplicatePercentage: idea.duplicatePercentage ?? 0,
  matchedIdeas: idea.matchedIdeas || [],
  roadmap: idea.roadmap || [],
  aiFeedback:
    idea.aiFeedback ||
    "AI analysis will be available once the backend and AI engine process this idea.",
  createdAt: idea.createdAt || new Date().toISOString(),
});

export const seedIdeasIfEmpty = () => {
  const stored = localStorage.getItem(IDEAS_KEY);

  if (!stored) {
    localStorage.setItem(IDEAS_KEY, JSON.stringify(mockIdeas));
  }
};

export const getStoredIdeas = () => {
  seedIdeasIfEmpty();

  try {
    const ideas = JSON.parse(localStorage.getItem(IDEAS_KEY)) || [];
    return ideas.map(normalizeIdea);
  } catch {
    localStorage.setItem(IDEAS_KEY, JSON.stringify(mockIdeas));
    return mockIdeas.map(normalizeIdea);
  }
};

export const saveIdeas = (ideas) => {
  localStorage.setItem(IDEAS_KEY, JSON.stringify(ideas.map(normalizeIdea)));
};

export const getIdeaById = (id) => {
  return getStoredIdeas().find((idea) => String(idea.id) === String(id));
};

export const submitIdea = (formData) => {
  const ideas = getStoredIdeas();

  const newIdea = normalizeIdea({
    ...formData,
    id: `idea-${Date.now()}`,
    status: "pending",
    feasibilityScore: Math.floor(Math.random() * 21) + 70,
    riskLevel: "Medium",
    duplicatePercentage: Math.floor(Math.random() * 35),
    matchedIdeas: ["AI-based idea evaluation platform", "Startup concept analyzer"],
    roadmap: [
      "Requirement analysis and feature finalization",
      "UI/UX design and frontend development",
      "Backend API and database integration",
      "Queue system integration",
      "AI engine and duplicate detection",
      "Testing and deployment",
    ],
    aiFeedback:
      "This idea looks feasible for a college major project. It can be improved by adding clear user roles, validation, and practical MVP planning.",
  });

  saveIdeas([newIdea, ...ideas]);

  return newIdea;
};

export const updateIdeaStatus = (id, status) => {
  const updatedIdeas = getStoredIdeas().map((idea) =>
    String(idea.id) === String(id) ? { ...idea, status } : idea
  );

  saveIdeas(updatedIdeas);

  return updatedIdeas.find((idea) => String(idea.id) === String(id));
};

export const getStats = () => {
  const ideas = getStoredIdeas();

  return {
    total: ideas.length,
    pending: ideas.filter((idea) => idea.status === "pending").length,
    processing: ideas.filter((idea) => idea.status === "processing").length,
    completed: ideas.filter((idea) => idea.status === "completed").length,
    duplicate: ideas.filter((idea) => idea.status === "duplicate").length,
    rejected: ideas.filter((idea) => idea.status === "rejected").length,
  };
};

export const submitIdeaApi = async (formData) => {
  try {
    const response = await api.post("/ideas", formData);
    return response.data;
  } catch {
    return {
      success: true,
      idea: submitIdea(formData),
      source: "mock",
    };
  }
};

export const getMyIdeasApi = async () => {
  try {
    const response = await api.get("/ideas/my");
    return response.data;
  } catch {
    return {
      success: true,
      ideas: getStoredIdeas(),
      source: "mock",
    };
  }
};