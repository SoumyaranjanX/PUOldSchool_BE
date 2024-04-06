import mongoose from 'mongoose';

const ThreadMessageSchema = new mongoose.Schema({
    thread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ThreadChat'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String
    }
}, { timestamps: true })

export const ThreadMessage = mongoose.model('ThreadMessage', ThreadMessageSchema);
