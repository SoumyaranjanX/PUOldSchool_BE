import userRoutes from "../routes/userRoutes.js";
import express from "express";
const router = express.Router();
router.use('/users', userRoutes);
// router.use('/chat', chatRoutes);

export default router;