import Idea from "../models/Idea.js";

const generateMockAnalysis = (idea) => {
  const score = Math.floor(Math.random() * 21) + 70;
  const duplicate = Math.floor(Math.random() * 35);

  return {
    feasibilityScore: score,
    duplicatePercentage: duplicate,
    riskLevel: score >= 85 ? "Low" : score >= 70 ? "Medium" : "High",
    status: duplicate > 60 ? "duplicate" : "completed",
    matchedIdeas:
      duplicate > 20
        ? ["AI idea evaluation system", "Startup roadmap generator"]
        : [],
    roadmap: [
      "Requirement analysis",
      "UI/UX design",
      "Frontend development",
      "Backend API integration",
      "Database integration",
      "AI engine integration",
      "Testing and deployment",
    ],
    aiFeedback:
      "This idea is feasible for a major project. Add clear user roles, validation, dashboard analytics, and AI scoring to make it stronger.",
  };
};

export const createIdea = async (req, res, next) => {
  try {
    const {
      title,
      category,
      problemStatement,
      proposedSolution,
      targetUsers,
      budget,
      timeline,
      description,
    } = req.body;

    if (!title || !problemStatement || !proposedSolution || !description) {
      res.status(400);
      throw new Error("Title, problem statement, proposed solution and description are required");
    }

    const analysis = generateMockAnalysis(req.body);

    const idea = await Idea.create({
      user: req.user._id,
      title,
      category,
      problemStatement,
      proposedSolution,
      targetUsers,
      budget,
      timeline,
      description,
      ...analysis,
    });

    res.status(201).json({
      success: true,
      idea,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyIdeas = async (req, res, next) => {
  try {
    const ideas = await Idea.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      ideas,
    });
  } catch (error) {
    next(error);
  }
};

export const getIdeaById = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      res.status(404);
      throw new Error("Idea not found");
    }

    const isOwner = idea.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error("Not allowed to access this idea");
    }

    res.json({
      success: true,
      idea,
    });
  } catch (error) {
    next(error);
  }
};

export const updateIdeaStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      res.status(404);
      throw new Error("Idea not found");
    }

    idea.status = status || idea.status;
    await idea.save();

    res.json({
      success: true,
      idea,
    });
  } catch (error) {
    next(error);
  }
};