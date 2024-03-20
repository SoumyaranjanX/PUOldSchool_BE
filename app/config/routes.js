import userRoutes from "../routes/userRoutes.js";
import urgentMessageRouter from "../routes/urgentMessageRoute.js";
import chatRoutes from "../routes/chatRoutes.js"
import express from "express";
import voltRouter from "../routes/voltRoutes.js";
import eventRouter from "../routes/eventRoutes.js";
import busRouter from "../routes/busRoute.js";
const router = express.Router();
router.use('/users', userRoutes);
router.use('/urgent', urgentMessageRouter);
router.use('/volt', voltRouter);
router.use('/event', eventRouter);
router.use('/bus', busRouter);
const socketRouter = express.Router();
socketRouter.use('/chat', chatRoutes);

export {
    router,
    socketRouter
};
