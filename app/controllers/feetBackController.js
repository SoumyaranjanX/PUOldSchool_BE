import { feetBack } from "../models/feetBack.js";
import { asyncHandler } from "../errorHander/asyncHandler.js";
import { ApiError } from "../errorHander/ApiError.js";
import { ApiResponse } from "../errorHander/ApiResponse.js";


export const createFeetback = asyncHandler(async (req, res, next) => {
    const { message } = req.body;
    const userId = req.user._id;

    if (!message) {
        return next(new ApiError("All fields are required.", 400));
    }
    try {

        const feetBackMessage = new feetBack({
            feetBackMessage: message,
            senderId: userId
        });
        await feetBackMessage.save();
        return res.status(200).json({
            success: true,
            feetBackMessage,
            message: "Feetback send successfully",
        });
    } catch (error) {
        console.error("Error uploading file to S3:", error);
        return next(error);
    }
});



export const getFeetback = asyncHandler(async (req, res, next) => {
    try {

        const messages = await feetBack.find()

        if (!messages) {
            return next(new ApiError("No feetback found", 500));
        }
        return res.status(201).json(
            new ApiResponse(201, messages, "feetback  Retrieved Successfully.")
        );
    } catch (error) {
        return next(new ApiError("Failed to get notice: " + error.message, 500));
    }
});

export const getFeetbackUser = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user._id;
        const feetbackMessages = await feetBack.find({ senderId: userId })

        if (!messages) {
            return next(new ApiError("No feetback found", 500));
        }
        return res.status(201).json(
            new ApiResponse(201, feetbackMessages, "feetback  Retrieved Successfully.")
        );
    } catch (error) {
        return next(new ApiError("Failed to get notice: " + error.message, 500));
    }
});

export const deleteFeetback = asyncHandler(async (req, res, next) => {
    try {
        const feetbackId = req.params.id;
        const message = await feetBack.findByIdAndDelete(feetbackId);

        if (!message) {
            return next(new ApiError("Feetback message does not exist", 404));
        }

        return res.status(200).json(
            new ApiResponse(200, message, "Feetback message deleted successfully.")
        );
    } catch (error) {
        return next(new ApiError("Failed to delete notice: " + error.message, 500));
    }
});
