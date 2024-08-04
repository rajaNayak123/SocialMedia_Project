import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verfiyJWT = asyncHandler(async (req, _, next) => {
    try {
        const Token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!Token) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedInfo = jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedInfo?._id).select("-password -refreshToken");

        if (!user) {
            // frontend
            throw new ApiError(401, "Invalid access token")
        }

        req.user = user;
        next()
    } catch (error) {

        throw new ApiError(401, error?.message || "invelid access token")
    }
})