import express from "express";

import { createNotice, getNotice } from "../controllers/noticeController.js";
const noticeRouter = express.Router();


noticeRouter.post("/creationnotice", createNotice);
noticeRouter.get("/getnotice", getNotice);
export default noticeRouter;