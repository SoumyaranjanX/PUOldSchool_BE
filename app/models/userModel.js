import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator";

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please enter the Name !!"],
        minLength: [3, "Provide At least 3 character !!"],
        validate: [validator.isAlpha, "name must cantain alphabet !!"]
    },
    email: {
        type: String,
        required: [true, "Please enter the Email !!"],
        validate: [validator.isEmail, "please provide valid Email !!"]
    },
    password: {
        type: String,
        required: [true, "Please enter the Password !!"],
        minLength: [6, "Password must contain at least 6 characters !!"],
    },
    deparment: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        maxLength: [12, "Please Provide Valide no"],
        minLength: [10, "Please Provide Valide no"]
    },
    refreshToken: {
        type: String
    }
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);