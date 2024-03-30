import express from "express";

import { createNotice, getNotice } from "../controllers/noticeController.js";
const noticeRouter = express.Router();
import multer from "multer";

const upload = multer({
    dest: 'temp/',
});

noticeRouter.post("/creationnotice", upload.single('image'), createNotice);
noticeRouter.get("/getnotice", getNotice);
export default noticeRouter;