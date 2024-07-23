import { Notice } from "../models/noticeModel.js";
import { asyncHandler } from "../errorHander/asyncHandler.js";
import { ApiError } from "../errorHander/ApiError.js";
import { ApiResponse } from "../errorHander/ApiResponse.js";
import { uploadOnS3 } from '../utils/awsS3.js';

export const createNotice = asyncHandler(async (req, res, next) => {
    const { title, shortDes } = req.body;

    console.log(title, shortDes)
    if (!title || !shortDes) {
        return next(new ApiError("All fields are required.", 400));
    }
    console.log("notice image", req.file)
    if (!req.file) {
        return next(new ApiError("No file uploaded", 400));
    }

    try {
        const file = req.file;
        const { uploadResponse, imageUrl } = await uploadOnS3(file, 'noticeImage');
        console.log(uploadResponse)
        if (!uploadResponse) {
            return next(new ApiError("Failed to upload file", 400));

        }

        // Create a new instance of the Notice model
        const notice = new Notice({
            title: title,
            noticeImage: imageUrl,
            shortDec: shortDes
        });
        await notice.save();
        return res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            data: {
                finalImageUrl: imageUrl
            }
        });
    } catch (error) {
        console.error("Error uploading file to S3:", error);
        return next(error);
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

export const deleteNotice = asyncHandler(async (req, res, next) => {
    try {
        const noticeId = req.params.id;
        const notice = await Notice.findByIdAndDelete(noticeId);

        if (!notice) {
            return next(new ApiError("Notice does not exist", 404));
        }
        
        return res.status(200).json(
            new ApiResponse(200, notice, "Notice deleted successfully.")
        );
    } catch (error) {
        return next(new ApiError("Failed to delete notice: " + error.message, 500));
    }
});
