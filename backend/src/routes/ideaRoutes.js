import express from "express";
import {
  createIdea,
  getIdeaById,
  getMyIdeas,
  updateIdeaStatus,
} from "../controllers/ideaController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createIdea);
router.get("/my", protect, getMyIdeas);
router.get("/:id", protect, getIdeaById);
router.patch("/:id/status", protect, updateIdeaStatus);

export default router;