import { ApiError } from "../errorHander/ApiError.js";
import { ApiResponse } from "../errorHander/ApiResponse.js"
import { asyncHandler } from "../errorHander/asyncHandler.js"
import { Message } from "../models/messageModel.js";
import { getLoggedInUserId } from "../utils/functions.js";
import { User } from "../models/userModel.js";
import { ThreadMessage } from "../models/threadMessageSchema.js";
import { ThreadChat } from "../models/threadChatModel.js";
import mongoose from 'mongoose';

// Function to create and save a new message
const createMessage = async (data) => {
    try {
        const { message, selectedType, messageTime, userId } = data;
        const sender = await User.findById(userId);
        const newMessage = new Message({
            sender: sender,
            message: message,
            messageType: selectedType,
            messageTime: messageTime
        });
        const savedMessage = await newMessage.save();
        return savedMessage._id;
    } catch (error) {
        console.error('Error saving message:', error);
        throw error;
    }
};

const fetchMessages = async (req, res) => {
    const pageNumber = req.query.pageNumber
    const pageSize = 10;
    const skip = (pageNumber - 1) * pageSize;
    
    try {
        let messages = await Message.find()
            .sort({ messageTime: -1 })
            .populate('sender')
            .skip(skip)
            .limit(pageSize); 
    
    
        const modifiedMessages = messages.map(message => {
            const imageUrl = message.sender && message.sender.imageUrl ? message.sender.imageUrl : 'https://pub-dc2feb6aa8314296ab626daad5932a49.r2.dev/default%20user%20profile%20image.png'; // Default image URL
            const senderId = message.sender.id
            delete message._doc.sender;
    
            return {
                ...message._doc,
                senderId,
                imageUrl
            };
        });
    
        // console.log(modifiedMessages);
    
        return res.status(200).send(modifiedMessages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
    
    
};

const createThread = asyncHandler(async (req, res, next) => {
    try {
        // Extract required data from the request
        const { messageId, initialMessage } = req.body;

        console.log("initial Message: ",initialMessage)
        console.log(messageId)
        const userId = req.user._id; // Assuming the user ID is stored in '_id' field

        // Verify that the message ID exists and fetch the sender's user ID from the message
        const message = await Message.findOne({ _id:messageId }).populate('sender', '_id');
        if (!message) {
            return next(new ApiError('Message not found', 404));
        }

        const senderId = message.sender._id;

        // Check if the sender ID and user ID are the same
        if (userId.toString() === senderId.toString()) {
            return next(new ApiError('Can not create thread on your own chat!', 400));
        }

        const existingThread = await ThreadChat.findOne({ message: messageId, participants: { $all: [userId, senderId] } });
        if (existingThread) {
            return next(new ApiError('Thread already exists for this message', 400));
        }

        // Create a new thread based on the provided message ID
        const newThread = new ThreadChat({
            message: messageId,
            participants: [userId, senderId] // Add the sender and the current user as participants
        });

        // Save the new thread to the database
        await newThread.save();

        // Create a new thread message
        const newThreadMessage = new ThreadMessage({
            thread: newThread._id,
            sender: userId, // The sender of the thread message is the current user
            message: initialMessage
        });

        // Save the new thread message to the database
        await newThreadMessage.save();

        // Update the lastMessage field of the ThreadChat document
        await ThreadChat.findByIdAndUpdate(newThread._id, { lastMessage: newThreadMessage._id });

        // Respond with success message
        const responseData = new ApiResponse(200, { threadId: newThread._id }, 'Thread created successfully');
        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error creating thread:', error);
        next(new ApiError('Internal server error', 500));
    }
});

const getMyThreads = asyncHandler(async (req, res, next) => {
    try {
        // Extract user ID from the request
        const userId = req.user._id;

        // Extract filter parameters from request body
        const { myInitiated, onMyMessages } = req.body;

        // Define filter criteria based on filter parameters
        const filter = {};
        if (myInitiated) {
            filter['participants'] = userId;
        }
        if (onMyMessages) {
            filter['message.sender'] = userId;
        }

        // Fetch threads based on filter criteria
        const threads = await ThreadChat.find(filter)
        .sort({ createdAt: -1 })
        .populate({
            path: 'message lastMessage',
            populate: {
                path: 'sender',
                select: 'imageUrl _id'
            }
        });

        console.log(threads)

        // Respond with the list of threads
        const responseData = new ApiResponse(200, { threads }, 'Threads retrieved successfully');
        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching threads:', error);
        next(new ApiError('Internal server error', 500));
    }
});

const fetchThreadMessages = asyncHandler(async (req, res, next) => {
    try {
        const pageNumber = req.query.pageNumber;
        const pageSize = 10;
        const skip = (pageNumber - 1) * pageSize;
        
        const { threadId } = req.query;

        let messages = await ThreadMessage.find({ thread: threadId })
            .sort({ createdAt: -1 })
            .populate('sender', 'imageUrl')
            .skip(skip)
            .limit(pageSize); 
    
        const formattedMessages = messages.map(message => ({
            senderId: message.sender._id,
            imageUrl: message.sender.imageUrl,
            message: message.message,
            time: message.createdAt
        }));

        console.log(formattedMessages)
    
        const responseData = new ApiResponse(200, { messages: formattedMessages }, 'Messages retrieved successfully');
        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching messages:', error);
        next(new ApiError('Internal server error', 500));
    }
});


const deleteThreadAndMessages = asyncHandler(async (req, res, next) => {
    try {
        // Extract thread ID from the request body
        const { threadId } = req.body;

        // Delete the thread and all associated messages
        await Promise.all([
            ThreadChat.deleteOne({ _id: threadId }), // Delete the ThreadChat document
            ThreadMessage.deleteMany({ thread: threadId }) // Delete all ThreadMessage documents associated with the thread
        ]);

        // Respond with success message
        const responseData = new ApiResponse(200, {}, 'Thread and associated messages deleted successfully');
        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error deleting thread and messages:', error);
        next(new ApiError('Internal server error', 500));
    }
});


export {
    createMessage,
    fetchMessages,
    createThread,
    getMyThreads,
    deleteThreadAndMessages,
    fetchThreadMessages
}
