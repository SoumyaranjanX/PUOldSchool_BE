import { ApiError } from "../errorHander/ApiError.js";
import { ApiResponse } from "../errorHander/ApiResponse.js"
import { asyncHandler } from "../errorHander/asyncHandler.js"
import { User } from "../models/userModel.js";




export const Register = asyncHandler(async (req, res) => {

    const { name, email, password, deparment, phone } = req.body;
    console.log(`${name} ${email} ${password}`)
    if (!name || !email || !password || !deparment || !phone === "") {
        throw new ApiError(400, "Please fill all field !!");
    }

    const existedUser = await User.findOne({ email })

    if (existedUser) {
        throw new ApiError(400, "Email already exist !!")
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

