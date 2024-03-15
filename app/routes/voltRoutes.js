import express from "express";
import { createVoltCard, deleteVoltCard, getVoltCard, updateVoltCard } from "../controllers/voltControllers.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
const voltRouter = express.Router();

voltRouter.post("/voltCard", verifyJWT, createVoltCard);
voltRouter.delete("/deletevoltcard/:id", verifyJWT, deleteVoltCard);
voltRouter.put("/updatevoltcard/:id", verifyJWT, updateVoltCard);
voltRouter.get("/getvoltcard/:id", verifyJWT, getVoltCard);

export default voltRouter;