import Idea from "../models/Idea.js";
import axios from "axios";
import PDFDocument from "pdfkit";

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

    const riskPenalty = aiResults.riskLevel === "High" ? 20 : aiResults.riskLevel === "Medium" ? 10 : 0;
    const ideaValue = (aiResults.feasibilityScore || 0) - (aiResults.duplicatePercentage || 0) - riskPenalty;

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
      status: "pending",
      ideaValue,
    });

    // Recalculate rankings for the user's ideas
    const userIdeas = await Idea.find({ user: req.user._id }).sort({ ideaValue: -1, createdAt: -1 });

    for (let i = 0; i < userIdeas.length; i++) {
      const currentIdea = userIdeas[i];
      if (i < 5) {
        currentIdea.rank = i + 1;
        currentIdea.status = "selected";
        currentIdea.selectionReason = `Ranked #${i + 1} based on idea value of ${currentIdea.ideaValue}`;
      } else {
        currentIdea.rank = null;
        currentIdea.status = "rejected";
        currentIdea.selectionReason = `Not in top 5. Idea value: ${currentIdea.ideaValue}`;
      }
      await currentIdea.save();
    }

    const updatedIdea = await Idea.findById(idea._id);

    res.status(201).json({
      success: true,
      idea: updatedIdea,
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
    const ideas = await Idea.find({ user: req.user._id }).sort({ rank: 1, ideaValue: -1, createdAt: -1 });

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

export const generateIdeaReport = async (req, res) => {
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

    const doc = new PDFDocument({ margin: 50 });

    // Set response headers for PDF download
    const filename = `IdeaReport-${idea.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");

    // Pipe PDF to response
    doc.pipe(res);

    // Title and Header
    doc.fontSize(24).fillColor("#222222").text("VisionFlow Idea Report", { align: "center" });
    doc.moveDown(1.5);

    doc.fontSize(20).fillColor("#0284c7").text(idea.title);
    doc.fontSize(12).fillColor("#64748b").text(`Category: ${idea.category}  |  Status: ${idea.status.toUpperCase()}  |  Rank: ${idea.rank ? `#${idea.rank}` : "N/A"}`);
    doc.moveDown();

    // Metrics Box
    doc.rect(50, doc.y, 500, 70).fillAndStroke("#f1f5f9", "#cbd5e1");
    doc.fillColor("#0f172a");
    const currentY = doc.y + 15;

    doc.fontSize(10).text("Idea Value", 70, currentY);
    doc.fontSize(14).fillColor("#0ea5e9").text(idea.ideaValue ?? "N/A", 70, currentY + 15);

    doc.fontSize(10).fillColor("#0f172a").text("Feasibility", 170, currentY);
    doc.fontSize(14).fillColor("#22c55e").text(`${idea.feasibilityScore ?? 0}%`, 170, currentY + 15);

    doc.fontSize(10).fillColor("#0f172a").text("Risk Level", 270, currentY);
    const riskColor = idea.riskLevel === "High" ? "#ef4444" : idea.riskLevel === "Medium" ? "#f59e0b" : "#22c55e";
    doc.fontSize(14).fillColor(riskColor).text(idea.riskLevel || "Pending", 270, currentY + 15);

    doc.fontSize(10).fillColor("#0f172a").text("Duplicate %", 370, currentY);
    doc.fontSize(14).fillColor("#0f172a").text(`${idea.duplicatePercentage ?? 0}%`, 370, currentY + 15);

    doc.moveDown(3);

    // Description
    doc.x = 50;
    doc.fontSize(16).fillColor("#0f172a").text("Description");
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor("#334155").text(idea.description, { width: 500, align: "justify" });
    doc.moveDown(1.5);

    // AI Analysis Feedback
    doc.fontSize(16).fillColor("#0f172a").text("AI Analysis Feedback");
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor("#334155").text(idea.aiFeedback || "No feedback available.", { width: 500, align: "justify" });
    doc.moveDown(1.5);

    // Roadmap
    if (idea.roadmap && idea.roadmap.length > 0) {
      doc.addPage();
      doc.fontSize(16).fillColor("#0f172a").text("Generated Roadmap");
      doc.moveDown(0.5);

      idea.roadmap.forEach((step, index) => {
        doc.fontSize(12).fillColor("#334155").text(`${index + 1}. ${step}`, {
          width: 500,
          align: "left",
        });
        doc.moveDown(0.5);
      });
    }

    doc.end();
  } catch (error) {
    console.error("PDF generation error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Error generating report" });
    }
  }
};