import {Like} from '../models/like.model.js'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js"
import {Video} from "../models/video.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    try {
        const {videoId} = req.params;
        // const {userId} = req.User._id;
    
       const likeItem = await Like.findOne({videoId})

        if(!likeItem){
            new Like({videoId, likes:1})
        }else{
            likeItem.likes += 1
        }

        await likeItem.save();

        return res
        .status(200)
        .json( new ApiResponse(
            200,
            "Video liked successfully",
            likeItem
        ))
    } catch (error) {
        throw new ApiError(500, {error:"Server error. Please try again later"})
    }
})

const toggleUnlikeVideo = asyncHandler(async(req,res)=>{
    // const userId = req.User._id;
    const videoId = req.params

    try {
     
    const unlikeItem = await Like.findOne({videoId});

    if(unlikeItem && unlikeItem.likes > 0){
        unlikeItem.likes -= 1;
        await unlikeItem.save()
    }
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Video unlike successfully",
        ))

    } catch (error) {
        throw new ApiError(500, {error:"Server error. Please try again"})
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    // const {userId} = req.User._id;

    try {
        const liked = await Like.find({Video:videoId}).populate('User','_id')

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            "All liked videos",
            liked
        ))
    } catch (error) {
        throw new ApiError(500, {error:"Server error. Please try again"})
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
}
)


export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    toggleUnlikeVideo,
    getLikedVideos,
}