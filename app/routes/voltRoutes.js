import express from "express";
import { createVoltCard } from "../controllers/voltControllers.js";

import { verifyJWT } from "../middlewares/authMiddleware.js";
const voltRouter = express.Router();

voltRouter.post("/voltCard", verifyJWT, createVoltCard);

export default voltRouter;