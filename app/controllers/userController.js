import { ApiError } from "../errorHander/ApiError.js";
import { ApiResponse } from "../errorHander/ApiResponse.js"
import { asyncHandler } from "../errorHander/asyncHandler.js"
import { User } from "../models/userModel.js";
import { sendMail } from "../utils/sendEmail.js"
import crypto from "crypto"

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}
export const Register = asyncHandler(async (req, res, next) => {

    const { name, email, password, department, phone } = req.body;
    console.log(name, email, password, department, phone)
    if (!name || !email || !password || !department || !phone === "") {
        return next(new ApiError("Please fill all field !!", 400));
    }

    const existedUser = await User.findOne({ email })

    if (existedUser) {
        return next(new ApiError("Email already exist !!!", 400));
    }

    const user = await User.create({
        name,
        email,
        password,
        department,
        phone
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
        return next(new ApiError("Invalid eamil or password !!", 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ApiError("Invalid eamil or password !!", 400));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

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
        console.log(req.user),
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




