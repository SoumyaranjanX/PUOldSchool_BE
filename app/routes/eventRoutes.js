import express from "express";
import { createEvent, deleteEvent, getEvent, updateEvent } from "../controllers/eventController.js";

import { verifyJWT } from "../middlewares/authMiddleware.js";
const eventRouter = express.Router();

eventRouter.post("/createevent", verifyJWT, createEvent);
eventRouter.post("/deleteevent/:id", verifyJWT, deleteEvent);
eventRouter.put("/updateevent/:id", verifyJWT, updateEvent);
eventRouter.get("/getevent/:id", verifyJWT, getEvent);
export default eventRouter;