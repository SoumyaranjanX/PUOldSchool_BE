import express from "express";
import { getBusTimings, insertDummy } from "../controllers/busController.js";

const busRouter = express.Router();

busRouter.post("/inertbus", insertDummy);
busRouter.post("/getbustime", getBusTimings);
export default busRouter;