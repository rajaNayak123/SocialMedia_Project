import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from "jsonwebtoken"
import mongoose, { Types } from 'mongoose'

// Generate the access and refresh tokens
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken();

        // store the refresh token in the database
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "something went going wrong while generating access and refresh tokens")
    }
}

const registerUser = asyncHandler(async (res, req) => {
    // res.send(200).json({ message: "ok" })

    // get user details from frontend
    // validation - check empty or not
    // check if user already exists : username, email
    // check for images and avtar
    // upload the images and avtar into the cloudinary
    // create the user object : create entry in db
    // remove the password and refresh token field from response
    // check user creation completed or not
    // return the res.


    // taking details from frontend 
    const { fullname, email, password, username } = res.body;

    console.log("email: " + email); 
    console.log("fullname: " + fullname); 
    console.log("password: " + password);
    console.log("username: " +username);

    // validation check the fields are empty or not

    // this some method check the element pass the test
    // method returns true (and stops) if the function returns true for one of the array elements.
    // method returns false if the function returns false for all of the array elements.
    if ([fullname, email, password, username].some((fild) => { fild?.trim() === "" })) {
        throw new ApiError(400, "Field are required")
    }

    // checking the user are already exist or not . 

    //the user provide mongoose then we can compare them by using findOne/find methods
    // the unique fields are username and email so we can check anyone 
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User already exist")
    }

    // handle the files

    // this files provide multer
    const avtarLoclapath = req.files?.avatar[0]?.path;
    // const coverImageLocalpath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath = "";
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avtarLoclapath) {
        throw new ApiError(400, "avatar file is required")
    }

    // upload the image and avatar into the cloudinary
    const avatar = await uploadCloudinary(avtarLoclapath);
    const coverImage = await uploadCloudinary(coverImageLocalPath);

    // const cloudImage = await uploadCloudinary(coverImageLocalpath);
    if (!avatar) {
        throw new ApiError(400, "avatar file is required")
    }


    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage.url || "",
        email,
        password,
        username: username.toLowerCase(),
    })

    // remove the password and refresh toke using select method it take unnecessary fields
    const userCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!userCreated) {
        throw new ApiError(500, "something went wrong during registreing user")
    }

    return res.status(201).json(
        new ApiResponse(201, userCreated, "user registered successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    // get data from user
    // username or email
    // find the user
    // check the password
    // access token and refresh token
    // send the tokens by the help of cookies

    const { email, username, password } = req.body;

    if (!(email || username)) {
        throw new ApiError(400, "Email or username is required")
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isValidPassword = await user.isCorrectPassword(password);

    if (!isValidPassword) {
        throw new ApiError(401, "Invalid password")
    }

    // get the refresh and access token
    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = User.findById(user._id).select("-password -refreshToken")

    //send into the cookie
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                // data
                { user: loggedInUser, refreshToken, accessToken },
                "user loggdin successfuly"
            )
        )
})

const logOut = asyncHandler(async (res, req) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
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
        .clearCookies("refreshToken", options)
        .clearCookies("accessToken", options)
        .json(new ApiResponse(200, {}, "user logout successfuly"))
})

const refreshAccessToken = asyncHandler(async (res, req) => {
    const incomeingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomeingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomeingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "invalid refresh token")
        }

        if (incomeingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "refresh token is expired or used")
        }

        const { accessToken, newrefreshToken } = await generateAccessAndRefreshToken(user._id)

        const options = {
            httpOnly: true,
            secure: true,
        }

        return res
            .status(200)
            .cookies("accessToken", accessToken, options)
            .cookies("newrefreshToken", newrefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, newrefreshToken },
                    "access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async (res, req) => {
    const { oldPassword, newPassword, conformPassword } = req.body

    if (newPassword !== conformPassword) {
        throw new ApiError(401, "newPassword not match with conformPassword")
    }

    const user = User.findById(req.user?._id)

    const isCorrectPassword = await user.isCorrectPassword(oldPassword)

    if (!isCorrectPassword) {
        throw new ApiError(400, "Incorrect password")
    }

    user.password = newPassword;

    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "password changed succesfully",
        ))
})

const getCurrentUser = asyncHandler(async (res, req) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            req.user,
            "current user fatched succesfully"
        ))
})

const updateUserAccountDetails = asyncHandler(async (res, req) => {
    const { email, fullname } = req.body

    if (!email || !fullname) {
        throw new ApiError(400, "All fields are required")
    }

    const user = User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                fullname,
                email
            }
        },
        { new: true }   // we can get information after updating
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account deatils update successfuly"))

})

const updateUserAvatar = asyncHandler(async (res, req) => {
    const avatarLocalPath = req.file.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    // TODO: delete the old avatar

    const avatar = await uploadCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading avatar")
    }

    await User.findByIdAndUpdate(

        req.user._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar updated successf"))
})

const updateUserCoverImage = asyncHandler(async (res, req) => {
    const coverImageLocalPath = req.file.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "CoverImage is missing")
    }

    const coverImage = await uploadCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading cover image")
    }

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "CoverImage updated successf"))
})

const getUserChannelProfile = asyncHandler(async (res, req) => {
    const { username } = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "User not exist")
    }

    // User.find({username}) // we can also find agrigation pipelines using match methods

    const channle = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscriberCount: {
                    $size: "$subscribers"
                },
                channelSubscribedToCount: {
                    $size: "subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                coverImage: 1,
                avatar: 1,
                subscriberCount: 1,
                channelSubscribedToCount: 1,
                isSubscribed: 1,
                email: 1,
            }
        }
    ])

    if (!channle?.length) {
        throw new ApiError(400, "User not exist")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, channle[0], "user channel fetched successfully"))
})

const getWatchHistory = asyncHandler(async (res, req) => {
    const user = await User.aggregate([     // Go into the user schema and match user id
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "Videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1,
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            user[0].watchHistory,
            "watch history fetched successfully"
        ))
})

export {
    registerUser,
    loginUser,
    logOut,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
};