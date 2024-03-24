import { Message } from "../models/messageModel.js";
import { getLoggedInUserId } from "../utils/functions.js";
import { User } from "../models/userModel.js";

// Function to create and save a new message
const createMessage = async (data) => {
    try {

        const { message, selectedType, messageTime, userId } = data
        const sender = await User.findById(userId)
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
    const pageSize = 10;
    const skip = (pageNumber - 1) * pageSize;
    
    try {
        let messages = await Message.find()
            .sort({ messageTime: -1 })
            .populate('sender') // Populate the sender field
            .skip(skip)
            .limit(pageSize); 
    
        const protocol = req.protocol;
        const host = req.get('host');
    
        const modifiedMessages = messages.map(message => {
            const imageUrl = message.sender && message.sender.imageUrl ? message.sender.imageUrl : '/public/assets/profileImages/default.webp'; // Default image URL
            const userProfileImage = `${protocol}://${host}${imageUrl}`;
            delete message._doc.sender;
    
            return {
                ...message._doc,
                imageUrl: userProfileImage
            };
        });
    
        console.log(modifiedMessages);
    
        return res.status(200).send(modifiedMessages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
    
    
};

export {
    createMessage,
    fetchMessages
}
