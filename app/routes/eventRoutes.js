import express from "express";
import { createEvent, deleteEvent, updateEvent, getEvents } from "../controllers/eventController.js";

import { verifyJWT } from "../middlewares/authMiddleware.js";
import multer from "multer";

const upload = multer({
    dest: 'temp/',
});

const eventRouter = express.Router();


eventRouter.post("/createEvent", upload.single('image'), createEvent);
eventRouter.post("/deleteEvent/:id", deleteEvent);
eventRouter.patch("/updateEvent/:id", updateEvent);
eventRouter.get("/getEvent", getEvents);
export default eventRouter;