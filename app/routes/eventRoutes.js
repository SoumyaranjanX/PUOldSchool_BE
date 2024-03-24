import express from "express";
import { createEvent, deleteEvent, updateEvent, getEvents } from "../controllers/eventController.js";

import { verifyJWT } from "../middlewares/authMiddleware.js";
import multer from "multer";

const upload = multer({
    dest: 'temp/',
});

const eventRouter = express.Router();


eventRouter.post("/createevent", upload.single('image'), createEvent);
eventRouter.post("/deleteevent/:id", deleteEvent);
eventRouter.patch("/updateevent/:id", updateEvent);
eventRouter.get("/getevent", getEvents);
export default eventRouter;