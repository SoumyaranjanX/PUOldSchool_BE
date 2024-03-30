import { Notice } from "../models/noticeModel.js";
import { asyncHandler } from "../errorHander/asyncHandler.js";
import { ApiError } from "../errorHander/ApiError.js";
import { ApiResponse } from "../errorHander/ApiResponse.js";

export const createNotice = asyncHandler(async (req, res, next) => {
    const { title, image, shortDec } = req.body;
    if (!image || !title || !shortDec) {
        return next(new ApiError("All fields are required.", 400));
    }

    try {
        const notice = await Notice.create({
            title,
            shortDec,
            image
        });

        if (!notice) {
            return next(new ApiError("Failed to create notice.", 500));
        }
        return res.status(201).json(
            new ApiResponse(201, notice, "Notice uploaded successfully.")
        );
    } catch (error) {
        return next(new ApiError("Failed to create notice: " + error.message, 500));
    }
});


export const getNotice = asyncHandler(async (req, res, next) => {
    try {
        const notice = await Notice.find()

        if (!notice) {
            return next(new ApiError("Notice does not Exist", 500));
        }
        return res.status(201).json(
            new ApiResponse(201, notice, "Notice  Retrieved Successfully.")
        );
    } catch (error) {
        return next(new ApiError("Failed to create notice: " + error.message, 500));
    }
});