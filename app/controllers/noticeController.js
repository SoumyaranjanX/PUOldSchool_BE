import { Notice } from "../models/noticeModel.js";
import { asyncHandler } from "../errorHander/asyncHandler.js";
import { ApiError } from "../errorHander/ApiError.js";
import { ApiResponse } from "../errorHander/ApiResponse.js";
import path from 'path';
import fs from 'fs';
import { S3Client, PutObjectCommand, HeadObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    region: 'auto',
    endpoint: 'https://5aa4c0acb0e25214c16ca695275482a8.r2.cloudflarestorage.com',
    credentials: {
        accessKeyId: '047595cdddd6f641d1665c8df6795aee',
        secretAccessKey: '05e386894068a1329c5a2236b1661c2f46dbc8d0cc81f22d451a2b5f2c0c0ccb',
    },
});
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
        const fileExtension = path.extname(file.originalname);

        const timestamp = Date.now(); // Get the current timestamp
        const uniqueFilename = `noticeImage_${timestamp}${fileExtension}`;
        // Check if the file already exists for the user
        const headParams = {
            Bucket: 'oldschool',
            Key: uniqueFilename
        };
        const params = {
            Bucket: 'oldschool',
            Key: uniqueFilename,
            Body: fs.createReadStream(file.path)
        };

        const data = await s3Client.send(new PutObjectCommand(params));
        const imageUrl = `https://pub-dc2feb6aa8314296ab626daad5932a49.r2.dev/${uniqueFilename}`;

        // Create a new instance of the Notice model
        const notice = new Notice({
            title: title,
            noticeImage: imageUrl,
            shortDec: shortDes
        });

        // Save the notice to the database
        await notice.save();

        return res.status(200).json({
            success: true,
            notice,
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