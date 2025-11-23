import express from "express";
import {protect} from "../middlewares/auth.js";
import { authorize } from '../middlewares/roles.js';
import { createJD, createJDWithAI } from "../controllers/jdController.js";

const router = express.Router();

// Manual JD creation
router.post("/:offerId", protect, authorize("HR"), createJD);

// AI-powered JD creation
router.post("/:offerId/ai", protect, authorize("HR"), createJDWithAI);

export default router;