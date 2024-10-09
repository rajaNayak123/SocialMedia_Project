import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; // this npm is used to incrept the password
const { Schema } = mongoose;
const userSchema = new Schema({
    username: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true,
    },
    fullname: {
        type: String,
        require: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, //cloudinary url
        require: true,
    },
    coverImage: {
        type: String
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref:'Video'
        }
    ],
    password: {
        type: String,
        require: [true, "password is required"]
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true })


//pre - it is an methods mongoose,middlware
userSchema.pre("save", async function (next) {  // we can't use arrow function because arrow function has no 'this' keyword reference
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

//custom methods
userSchema.methods.isCorrectPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

//accessToken are temporary credentials that grant access to a protect resourse
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullname: this.fullname,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// And refreshToken are used to obtain new accessToken once the current token is expaired
userSchema.methods.generateRefreshToken = function () {
    jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)