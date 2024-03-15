import mongoose, { Schema } from "mongoose";

const eventSchema = new mongoose.Schema({

    eventManger: {
        type: Schema.Types.ObjectId,
        ref: "User"

    },
    eventName: {
        type: String,
        required: [true, "Please Provide the Event Name "]
    },
    category: {
        type: String,
        enum: ["Sport Events", "Cultural Events", "Social Events"]

    },
    location: {
        type: String,
        required: [true, "Please Provide the location"]
    },
    FormDate: {
        type: Date
    },
    FormTime: {
        type: String
    },
    toDate: {
        type: Date
    },
    toTime: {
        type: String
    },
    imageUrl: {
        type: String
    }

})

export const Event = mongoose.model("Events", eventSchema)