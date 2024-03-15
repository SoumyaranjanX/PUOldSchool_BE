import express from "express";
import { createUrgentMessage } from "../controllers/uergentMessaging.js"
const urgentMessageRouter = express.Router();

urgentMessageRouter.post("/urgentMessageRouter", createUrgentMessage);

export default urgentMessageRouter;