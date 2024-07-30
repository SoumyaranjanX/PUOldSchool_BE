import mongoose from "mongoose";
const feetBackSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    feetBackMessage: {
        type: String
    }

}, { timestamps: true });

export const feetBack = new mongoose.model("feetBack", feetBackSchema)