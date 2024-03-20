import mongoose from "mongoose";


const MessageSchema = new mongoose.Schema({
    sender:{
        // type:mongoose.Schema.ObjectId,
        // ref:"User"
        type:String
    },
    message:{
        type:String
    },
    messageType: {
        type: String,
        enum: ['Hey Buddy', 'Lost & Found', 'Information', "Requirement & Fulfilment"]
    },
    messageTime: {
        type: Date
    }

});

export const Message = new mongoose.model("Message",MessageSchema)