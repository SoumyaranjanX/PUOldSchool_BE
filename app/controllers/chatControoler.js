import { Message } from "../models/messageModel.js";
import { getLoggedInUserId } from "../utils/functions.js";

// Function to create and save a new message
const createMessage = async (data) => {
    try {
        const sender = await getLoggedInUserId();
        const { message, selectedType, messageTime } = data
        const newMessage = new Message({
            sender: sender,
            message: message,
            messageType: selectedType,
            messageTime: messageTime
        });
        newMessage.save();
    } catch (error) {
        console.error('Error saving message:', error);
        throw error;
    }
};

const fetchMessages = async (req, res) => {
    const pageNumber = req.query.pageNumber
    console.log(pageNumber)
    const pageSize = 10;
    const skip = (pageNumber - 1) * pageSize;
    
    try {
        // Assuming you have a Message model
        const messages = await Message.find()
            .sort({ messageTime: -1 })
            .skip(skip)
            .limit(pageSize); 
        return res.status(200).send(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};



export {
    createMessage,
    fetchMessages
}
