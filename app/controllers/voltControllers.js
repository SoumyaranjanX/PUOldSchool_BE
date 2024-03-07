import { Volt } from "../models/voltModel.js";
import { asyncHandler } from "../errorHander/asyncHandler.js";
import { ApiError } from "../errorHander/ApiError.js";
import { ApiResponse } from "../errorHander/ApiResponse.js";
import cloudinary from "cloudinary";

export const createVoltCard = asyncHandler(async (req, res, next) => {
    // const { voltType } = req.body;

    // // Check if voltType is provided
    // console.log(voltType)
    // if (!voltType) {
    //     return next(new ApiError("Volt Type is required.", 400));
    // }

    // Check if the file is uploaded successfully
    if (!req.files || !req.files.IdCard) {
        return next(new ApiError("Id Card file is required.", 400));
    }

    const IdCard = req.files.IdCard;
    // const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

    // if (!allowedFormats.includes(IdCard.mimetype)) {
    //     return next(
    //         new ApiError("Invalid file type. Please upload a PNG, JPEG, or WEBP file.", 400)
    //     );
    // }

    const cloudinaryResponse = await cloudinary.uploader.upload(IdCard.tempFilePath, {
        resource_type: "auto"
    });


    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
            "Cloudinary Error:",
            cloudinaryResponse.error || "Unknown Cloudinary error"
        );
        return next(new ApiError("Failed to upload Id Card to Cloudinary", 500));
    }

    const volt = await Volt.create({
        user_id: req.user._id,

        idImage: cloudinaryResponse.url
    });

    if (!volt) {
        return next(new ApiError("Failed to create Volt card.", 500));
    }

    return res.status(201).json(
        new ApiResponse(200, volt, "Volt Card Created Successfully.")
    );
});
