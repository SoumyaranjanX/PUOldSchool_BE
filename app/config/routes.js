import userRoutes from "../routes/userRoutes.js";
import urgentMessageRouter from "../routes/urgentMessageRoute.js";
import express from "express";
import voltRouter from "../routes/voltRoutes.js";
const router = express.Router();
router.use('/users', userRoutes);
router.use('/urgent', urgentMessageRouter);
router.use('/volt', voltRouter);

export default router;