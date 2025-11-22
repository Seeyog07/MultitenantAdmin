// routes/index.js
import express from 'express';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import recruiterRoutes from './Recruiter.js';
import candidateRoutes from './candidateRoutes.js';
import ticketRoutes from './ticketRoutes.js'
import offerRoutes from "./offerRoutes.js"
import jdRoutes from "./jdRoutes.js"

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/recruiter', recruiterRoutes);
router.use('/tickets', ticketRoutes);
router.use('/candidate', candidateRoutes);
router.use('/offer', offerRoutes);
router.use('/candidate', jdRoutes);

// add other routes: /users, /jobs, etc.

export default router;
