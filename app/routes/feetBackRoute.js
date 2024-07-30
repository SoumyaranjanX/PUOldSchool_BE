import express from "express"
import { getFeetback, createFeetback, deleteFeetback, getFeetbackUser } from '../controllers/feetBackController.js'
const feetBackRouter = express.Router();
import { verifyJWT } from "../middlewares/authMiddleware.js"
feetBackRouter.post("/createFeetback", verifyJWT, createFeetback);
feetBackRouter.get("/getFeetbackmessage", verifyJWT, getFeetbackUser);
feetBackRouter.get("/getFeetback", getFeetback);
feetBackRouter.delete("/deleteFeetback/:id", deleteFeetback);
export default feetBackRouter;