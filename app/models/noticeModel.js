import mongoose, { Schema } from "mongoose";

const noticeSchema = new mongoose.Schema({

    title: {
        type: String
    },
    image: {
        type: String

    },
    shortDec: {
        type: String

    }

}, { timestamps: true })

export const Notice = mongoose.model("Notice", noticeSchema)