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
        enum: ["Sport Events", "Cultural Events", "Social Events", "Educational Events"]
    },
    location: {
        type: String,
        required: [true, "Please Provide the location"]
    },
    eventDetails:{
        type:String
    },
    fromDate: {
        type: Date
    },
    fromTime: {
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
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    

}, { timestamps: true });

export const Event = mongoose.model("Events", eventSchema)