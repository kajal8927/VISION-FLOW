import Idea from "../models/Idea.js";
import axios from "axios";

export const createIdea = async (req, res) => {
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
      return res.status(400).json({ success: false, message: "Title, problem statement, proposed solution and description are required" });
    }

    // Fetch existing ideas for duplicate checking
    const existingIdeasData = await Idea.find({ user: req.user._id }).select("title description problemStatement proposedSolution");
    const existingIdeaTexts = existingIdeasData.map((idea) => 
      `${idea.title || ""} ${idea.description || ""} ${idea.problemStatement || ""} ${idea.proposedSolution || ""}`.trim()
    );

    let aiResults;
    try {
      const aiEngineUrl = process.env.AI_ENGINE_URL || "http://127.0.0.1:8000";
      const aiResponse = await axios.post(`${aiEngineUrl}/analyze`, {
        title,
        description,
        existingIdeas: existingIdeaTexts
      });
      aiResults = aiResponse.data;
    } catch (aiError) {
      console.error("FastAPI Error:", aiError.message);
      aiResults = {
        feasibilityScore: 50,
        riskLevel: "Medium",
        duplicatePercentage: 0,
        roadmap: [],
        aiFeedback: "AI engine unavailable"
      };
    }

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
      feasibilityScore: aiResults.feasibilityScore,
      riskLevel: aiResults.riskLevel,
      duplicatePercentage: aiResults.duplicatePercentage,
      roadmap: aiResults.roadmap,
      aiFeedback: aiResults.aiFeedback,
      status: "completed",
    });

    res.status(201).json({
      success: true,
      idea,
    });
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      ideas,
    });
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ success: false, message: "Idea not found" });
    }

    const isOwner = idea.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Not allowed to access this idea" });
    }

    res.json({
      success: true,
      idea,
    });
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateIdeaStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ success: false, message: "Idea not found" });
    }

    idea.status = status || idea.status;
    await idea.save();

    res.json({
      success: true,
      idea,
    });
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};