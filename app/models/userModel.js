import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator";
import crypto from "crypto"

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please enter your full name."],
        validate: {
            validator: function(value) {
                return /^[a-zA-Z\s]*$/.test(value);
            },
            message: "Name must contain only alphabets and spaces."
        },
        minLength: [3, "Please provide at least 3 characters for your name."]
    },
    regNo: {
        type: String,
        required: [true, "Please enter the PU Registration Number !!"]
    },
    department: {
        type: String,
        required: true
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
    phone: {
        type: Number,
        maxLength: [12, "Please Provide Valide no"],
        minLength: [10, "Please Provide Valide no"]
    },
    imageUrl: {
        type: String
    },
    hostel: {
        type: String
    },
    libraryId: {
        type: String
    },
    dateOfBirth: {
        type: String
    },
    bloodGroup: {
        type: String
    },
    address: {
        type: String
    },
    refreshToken: {
        type: String
    },
    resetPasswordExpire: {
        type: String
    },
    resetPasswordToken: {
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


userSchema.methods.getResetToken = function () {
    // create reset token in hexdecemal formate using crypto
    const resetToken = crypto.randomBytes(20).toString("hex");
    // reset token password will expire after 10 min
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    // hashing the token using sha256 algorithm and store hash token to database
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    return resetToken;
}

export const User = mongoose.model("User", userSchema);