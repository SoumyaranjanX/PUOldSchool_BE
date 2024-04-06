import mongoose from "mongoose";

const urgentMessage = new mongoose.Schema({

    UrgentMessageType: {
        type: String,
        required: [true, "Please Select Any Required Options !!"],
        enum: ["BLOOD REQUIREMENT", "FIRE", "ANIMAL AWARENESS", "SECURITY BREACH", "OTHER'S"]

    },
    ShortDescription: {
        type: String,
        required: [true, "Short Description is Required !!"],
        maxLength: [15, "please Atmost 15 words  !!"]
    },
    DetailDescription: {
        type: String,
        maxLength: [50, "please Atmost 50 words  !!"],
    }
}, { timestamps: true });

export const UrgentMessage = mongoose.model("UrgentMessage", urgentMessage)
