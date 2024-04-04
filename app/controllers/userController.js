import { ApiError } from "../errorHander/ApiError.js";
import { ApiResponse } from "../errorHander/ApiResponse.js"
import { asyncHandler } from "../errorHander/asyncHandler.js"
import { User } from "../models/userModel.js";
import { sendMail } from "../utils/sendEmail.js"
import crypto from "crypto"
import path from "path";
import fs from "fs"
import { fileURLToPath } from 'url';
import { uploadOnS3 } from '../utils/awsS3.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        console.log("Something went wrong while generating referesh and access token")
        return false, false;
    }
}

// authentication
export const Register = asyncHandler(async (req, res, next) => {

    const { name, regNo, department, email, password } = req.body;

    if (!name || !email || !password || !department || !regNo) {
        return next(new ApiError("Please fill all field !!", 400));
    }

    const existedUser = await User.findOne({ email })

    if (existedUser) {
        return next(new ApiError("Email already exist !!!", 400));
    }

    const user = await User.create({
        name,
        regNo,
        email,
        password,
        department
    })
    res.status(200).json(
        new ApiResponse(200, user, "User registered Successfully")
    )
})

export const Login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password === "") {
        return next(new ApiError("Please fill all field !!", 400));
    }

    const user = await User.findOne({ email }).select("+password")

    if (!user) {
        return next(new ApiError("Invalid email or password !!", 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ApiError("Invalid email or password !!", 400));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    if (!accessToken || !refreshToken) {
        return next(new ApiError("Internal Server Error !!", 500));
    }

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )
})

export const Logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})

// forget password 
export const forgotPassword = asyncHandler(async (req, res, next) => {

    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        return next(new ApiError("User Not Found !!!", 400))
    }

    const resetToken = await user.getResetToken();
    await user.save();
    const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`

    const message = `Click on the link to reset the password  ${url} if you have not 
    request than please ignor `

    sendMail(user.email, "Reset Password", message)

    res.status(200).json(
        // new ApiResponse(200, user.email, "RestToken has been sent Successfully !!!")
        {
            success: true,
            message: `RestToken has been sent at this email ${user.email} Successfully !!!`
        }
    )
})

export const resetPassword = asyncHandler(async (req, res, next) => {

    const { token } = req.params;

    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {
            $gt: Date.now()
        }
    })

    if (!user) {
        return next(new ApiError("Try Again", 400))
    }

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save()
    res.status(200).json(
        new ApiResponse(200, "Password Change Successfully !!!")

    )
})

// data management
export const getUser = asyncHandler(async (req, res, next) => {
    const user = req.user
    if (!user) {
        return next(new ApiError("User Not Found !!", 400));
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user
            )
        )
})

export const changeProfileImage = asyncHandler(async (req, res, next) => {
    const user = req.user;
    if (!user) {
        return next(new ApiError("User Not Found !!", 400));
    }

    if (!req.file) {
        return next(new ApiError("No file uploaded", 400));
    }
    try {
        const file = req.file;
        const userId = user.id;


        const uniqueFilename = `${userId}-Profile${fileExtension}`;

        // Get the existing key for the user's profile image, if it exists
        const existingKey = user.imageUrl ? path.basename(user.imageUrl) : null;

        // Upload the file to AWS S3, replacing the existing file if it exists
        const uploadResponse = await uploadOnS3(file, commingFrom = changeProfiles, existingKey);

        if (!uploadResponse) {
            throw new Error("Failed to upload file to S3");
        }

        // Update user's imageUrl with the new S3 URL
        user.imageUrl = `${process.env.IMAGE_URI}/${uniqueFilename}`;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            data: {
                finalImageUrl: user.imageUrl
            }
        });
    } catch (error) {
        console.error("Error uploading file to S3:", error);
        return next(error);
    }
});


export const updatePersonalDetails = asyncHandler(async (req, res, next) => {
    const user = req.user;
    if (!user) {
        return next(new ApiError("User Not Found !!", 400));
    }

    try {
        const { hostel, department, libraryId, dateOfBirth, bloodGroup, address } = req.body;

        console.log(hostel)

        // Update user's personal details if available
        if (hostel !== 'N/A') user.hostel = hostel;
        if (department !== 'N/A') user.department = department;
        if (libraryId !== 'N/A') user.libraryId = libraryId;
        if (dateOfBirth !== 'N/A') user.dateOfBirth = dateOfBirth;
        if (bloodGroup !== 'N/A') user.bloodGroup = bloodGroup;
        if (address !== 'N/A') user.address = address;

        // Save the updated user
        await user.save();

        return res.status(200).json(
            new ApiResponse(
                200,
                'Profile Updated'
            )
        );
    } catch (error) {
        console.log(error);
        return next(new ApiError("Failed to update profile", 500));
    }
});


export const getUserProfileImage = async (userId) => {
    try {
        const user = await User.findById(userId)
        return user.imageUrl;
    }
    catch (error) {
        console.log(error)
    }
}
