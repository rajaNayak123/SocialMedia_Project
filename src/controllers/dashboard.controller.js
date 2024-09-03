import {Video} from '../models/video.model.js'
import {Subscription} from '../models/subscription.model.js'
import {Like} from '../models/like.model.js'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

        try {
            const channelId =  req.params.channelId
    
            // fetch the total number of videos
            const totalVideo = await Video.countDocuments({channelId})
    
            // fetch total number of views
            const totalViews = await Video.aggregate([
                {$match:{channelId}}
                ,
                {$group:{_id:null}, totalViews:{$sum:"$views"}}
            ])
    
            // fetch total number of subscriber
            const totalSubscribers = await Subscription.countDocuments(channelId)
    
            // fetch total number of likes
            const totalLikes = await Like.countDocuments({channelId})
    
            const state = {
                totalVideo,
                totalViews,
                totalSubscribers,
                totalLikes
            }
    return res
    .status(200)
    .json(new ApiResponse(200, "Channel stats retrieved successfully", state))

        } catch (error) {
            throw new ApiError(501,"error while getChannelStats", error)
        }   
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const {channelId} = req.params

    // fetch the all videos by the chennel
    const videos = await Video.findById(channelId)

    if(!videos.length >0){
        throw new ApiError(404, 'No videos found for this channel');
    }

    return res 
    .status(200)
    .json(new ApiResponse(200,"Channel videos retrieved successfully",videos))
})

export {
    getChannelStats, 
    getChannelVideos
    }