import express from "express";
import {protect} from "../middlewares/auth.js";
import { authorize } from '../middlewares/roles.js';
import { createJD } from "../controllers/jdController.js";

const router = express.Router();

router.post("/:offerId", protect, authorize("HR"), createJD);

export default router;