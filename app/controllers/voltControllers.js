import { Volt } from "../models/voltModel.js";
import { asyncHandler } from "../errorHander/asyncHandler.js";
import { ApiError } from "../errorHander/ApiError.js";
import { ApiResponse } from "../errorHander/ApiResponse.js";
import path from 'path';
import { uploadOnS3 } from '../utils/awsS3.js';
export const createVoltCard = asyncHandler(async (req, res, next) => {
    const { voltType } = req.body;
    console.log(voltType)
    if (!voltType) {
        return next(new ApiError("Volt Type andimage is required.", 400));
    }
    if (!req.file) {
        return next(new ApiError("No file uploaded", 400));
    }
    const file = req.file;
    const fileExtension = path.extname(file.originalname);

    const timestamp = Date.now();
    const uniqueFilename = `noticeImage_${timestamp}${fileExtension}`;
    const uploadResponse = await uploadOnS3(file, 'voultImage');
    
    if (!uploadResponse) {
        return next(new ApiError("No file uploaded", 400));
    }

    const imageUrl = `${process.env.IMAGE_URI}/${uniqueFilename}`;

    const volt = await Volt.create({
        user_id: req.user._id,
        voltType: voltType,
        idImage: imageUrl
    });

    await volt.save();
    console.log(volt)

    if (!volt) {
        return next(new ApiError("Failed to create Volt card.", 400));
    }

    return res.status(201).json(
        new ApiResponse(200, volt, "Volt Card Created Successfully.")
    );
});


export const getVoltCard = asyncHandler(async (req, res, next) => {
    const voltId = req.params.id;

    // Find the Volt card by ID
    const volt = await Volt.findById(voltId);

    if (!volt) {
        return next(new ApiError("Volt Card not found", 404));
    }

    return res.status(200).json(
        new ApiResponse(200, volt, "Volt Card Details Retrieved Successfully.")
    );
});



export const deleteVoltCard = asyncHandler(async (req, res, next) => {
    const voltId = req.params.id;

    // Delete the Volt card by ID
    const deletedVolt = await Volt.findByIdAndDelete(voltId);

    if (!deletedVolt) {
        return next(new ApiError("Volt Card not found", 404));
    }

    return res.status(200).json(
        new ApiResponse(200, deletedVolt, "Volt Card Deleted Successfully.")
    );
});


export const updateVoltCard = asyncHandler(async (req, res, next) => {
    const voltId = req.params.id;
    const { voltType, idImage } = req.body;

    // Check if voltType is provided
    if (!voltType || !idImage) {
        return next(new ApiError("Volt Type and Image are required.", 400));
    }

    // Update the Volt card by ID
    const updatedVolt = await Volt.findByIdAndUpdate(
        voltId,
        { voltType, idImage },
        { new: true, runValidators: true }
    );

    if (!updatedVolt) {
        return next(new ApiError("Volt Card not found", 404));
    }

    return res.status(200).json(
        new ApiResponse(200, updatedVolt, "Volt Card Updated Successfully.")
    );
});

