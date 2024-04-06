import mongoose from 'mongoose';

const ThreadChatSchema = new mongoose.Schema({
    message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ThreadMessage'
    }
}, { timestamps: true })

export const ThreadChat = mongoose.model('ThreadChat', ThreadChatSchema);

