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
        enum: ['body system', 'medical', 'information',"buy sell"]
    }

},{timestamps:true});

export const Message = new mongoose.model("Message",MessageSchema)