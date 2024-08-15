import { Video } from "../models/video.model";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadCloudinary } from "../utils/uploadCloudinary.js";

const getAllVideos = asyncHandler(async (res, req) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  // get all videos based on the query , sort, pagination
});

const publishVideos = asyncHandler(async (res, req) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
});

const getVideoById = asyncHandler(async (res, req) => {
  const { videoId } = req.params;
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export { 
    getAllVideos,
    publishVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
};
