import { ApiError } from "../errorHander/ApiError.js";
import { ApiResponse } from "../errorHander/ApiResponse.js"
import { asyncHandler } from "../errorHander/asyncHandler.js"
import { User } from "../models/userModel.js";



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

    const { name, email, password, deparment, phone } = req.body;

    if (!name || !email || !password || !deparment || !phone === "") {
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
        deparment,
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
    console.log(user)

    if (!user) {
        return next(new ApiError("Invalid eamil or password !!", 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ApiError("Invalid eamil or password !!", 400));
    }
    console.log(`${user._id}`)
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




export const logout = asyncHandler(async (req, res) => {
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



