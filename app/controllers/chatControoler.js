import { Message } from "../models/messageModel.js";

// Function to create and save a new message
export const createMessage = async (req,res) => {
    try {
       
          const {sender, message, messageType} = req.body
           const newMessage = new Message({
            sender: sender,
            message: message,
            messageType:messageType
        });
        const savedMessage = await newMessage.save();
        res.status(200).json({
            message:"message save sucessfully"
        })
        return savedMessage;
    } catch (error) {
        // Handle error
        console.error('Error saving message:', error);
        throw error; // Rethrow the error for the calling function to handle
    }
};
