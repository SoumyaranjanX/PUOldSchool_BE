import { UrgentMessage } from "../models/uergentMessageModel.js"
import { ApiError } from "../errorHander/ApiError.js";
import { ApiResponse } from "../errorHander/ApiResponse.js"


export const createUrgentMessage = async (req, res, next) => {
    const { UrgentMessageType, ShortDescription, DetailDescription } = req.body;

    try {
        // Check if required fields are provided
        console.log(UrgentMessageType, ShortDescription)
        if (!UrgentMessageType || !ShortDescription) {
            throw new ApiError("Please fill all fields!", 400);
        }

        // Create a new urgent message
        const urgentMessage = new UrgentMessage({
            UrgentMessageType,
            ShortDescription,
            DetailDescription,
        });

        // Save the urgent message to the database
        await urgentMessage.save();

        // Send a success response
        res.status(200).json(new ApiResponse(200, urgentMessage, "Message saved successfully"));
    } catch (error) {
        // Handle errors and pass them to the error handling middleware
        return next(error);
    }
};