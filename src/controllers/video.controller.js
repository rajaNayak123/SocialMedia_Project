import { Video } from "../models/video.model";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadCloudinary } from "../utils/uploadCloudinary.js";

const getAllVideos = asyncHandler(async (res, req) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;
  // get all videos based on the query , sort, pagination

  const filter = {};

  if (query) {
    filter.title = { $regex: query, $options: "i" };
  }

  if (userId) {
    filter.owner = userId;
  }

  const videos = await Video.find(filter)
    .sort({ [sortBy]: sortType })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Video.countDocuments(filter);

  return res
  .status(200)
  .json(new ApiResponse(200,"Videos retrieved successfully",{ videos, total, page, limit }))
});

const publishVideos = asyncHandler(async (res, req) => {
  try {
    const { title, description } = req.body;
    const {file} = req;
    // TODO: get video, upload to cloudinary, create video
  
    if (!file) {
      throw new ApiError(400, "No video file uploaded");
    }
  
    const uploadResult = await uploadCloudinary(file.path, 'video')
  
    const video = await Video.create({
      title,
      description,
      vedioFile: uploadResult.url,
      owner: req.User._id
    })
  
    return res.
    status(201)
    .json(new ApiResponse(true,"Video published successfully", video))

  } catch (error) {
    throw new ApiError(400, "Failed to publish video", error);
  }
});

const getVideoById = asyncHandler(async (res, req) => {
  try {
    const { videoId } = req.params;
    //TODO: get video by id
  
    const video = await Video.findById({videoId});
  
    if(!video){
      throw new ApiError(404, "Video not found")
    }
  
    return res
    .status(200)
    .json(new ApiResponse(true, "Video retrieved successfully", video));
  } catch (error) {
      throw new ApiError(400, "Failed to geting video through the id", error);
  } 
});

const updateVideo = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, description, thumbnail } = req.body;
    //TODO: update video details like title, description, thumbnail
  
    const video = await Video.findById({videoId})
  
    if(!video){
      throw new ApiError(404,"video not found");
    }
  
    if(title) video.title = title;
    if(description) video.description = description;
    if(thumbnail) video.thumbnail = thumbnail;
  
    await video.save();
    
    return res
    .status(200)
    .json(new ApiResponse(true, "video updated successfully", video))
  } catch (error) {
      throw new ApiError(404,"Error while update video",error)
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    //TODO: delete video
  
    const video = await Video.findById({videoId})
  
    if(!video){
      throw new ApiError(404, "Video not found")
    }
  
    await video.remove();
  
    return res
    .status(202)
    .json(new ApiResponse(true,"Video deleted successfully"))
  } catch (error) {
    throw new ApiError(404,"Error while delete video",error)
  } 
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
  
    const video = await Video.findById({videoId});
  
    if(!video){
      throw new ApiError(201, "Video not found")
    }
  
    video.isPublished = !video.isPublished;
  
    await video.save();
    
    return res
    .status(200)
    .json(new ApiResponse(true, "Video publish status toggled successfully", { isPublished: video.isPublished }));
  
  } catch (error) {
    throw new ApiError(404, "geting error while publish video")
  }

});

export {
  getAllVideos,
  publishVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
