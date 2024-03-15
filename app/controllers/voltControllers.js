import { Volt } from "../models/voltModel.js";
import { asyncHandler } from "../errorHander/asyncHandler.js";
import { ApiError } from "../errorHander/ApiError.js";
import { ApiResponse } from "../errorHander/ApiResponse.js";


export const createVoltCard = asyncHandler(async (req, res, next) => {
    const { voltType, idImage } = req.body;

    // Check if voltType is provided
    console.log(voltType)
    if (!voltType || !idImage) {
        return next(new ApiError("Volt Type andimage is required.", 400));
    }

    // // Check if the file is uploaded successfully
    // if (!req.files || !req.files.IdCard) {
    //     return next(new ApiError("Id Card file is required.", 400));
    // }

    // const IdCard = req.files.IdCard;


    // const cloudinaryResponse = await cloudinary.uploader.upload(IdCard.tempFilePath, {
    //     resource_type: "auto"
    // });


    // if (!cloudinaryResponse || cloudinaryResponse.error) {
    //     console.error(
    //         "Cloudinary Error:",
    //         cloudinaryResponse.error || "Unknown Cloudinary error"
    //     );
    //     return next(new ApiError("Failed to upload Id Card to Cloudinary", 500));
    // }

    const volt = await Volt.create({
        user_id: req.user._id,
        voltType,
        idImage
    });

    if (!volt) {
        return next(new ApiError("Failed to create Volt card.", 500));
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

