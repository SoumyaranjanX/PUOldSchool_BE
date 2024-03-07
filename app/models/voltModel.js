import mongoose, { Schema } from "mongoose";

const voltSchema = new mongoose.Schema({

    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User"

    },
    voltType: {
        type: String,
        required: true,
        enum: ["Mess Card", "University Id Card", "Hostel Id"]
    },
    idImage: {
        type: String

    }

})

export const Volt = mongoose.model("Volt", voltSchema)