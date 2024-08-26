import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addComment = asyncHandler(async (req, res) => {
  try {
    const { content, videoId, ownerId } = req.body;

    const video = await Video.findById(videoId);
    const user = await User.findById(ownerId);

    if (!video) throw new ApiError(402, "No video found");
    if (!user) throw new ApiError(402, "No user found");

    const newComment = new Comment({
      content,
      video: videoId,
      owner: ownerId,
    });

    const saveComment = await newComment.save();

    return res
      .status(201)
      .json(new ApiResponse(201, saveComment, "Now comments are saved"));
  } catch (error) {
    throw new ApiError(500, "failed to create comment", error);
  }
});

const getVideoComments = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    const comments = await Comment.find({ video: videoId })
      .populate("owner", "username")
      .sort("-createdAt");

    return res
      .status(200)
      .json(new ApiResponse(200, comments, "Comments gets successfully"));
  } catch (error) {
    throw new ApiError(500, "failed to get comments", error);
  }
});

const updateComment = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const updateComment = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    );

    if(!updateComment) throw new ApiError(404, "comment not found")

    return res
    .status(200)
    .json( new ApiResponse(200,updateComment, "comments updated successfully"))
  } catch (error) {
    console.log("failed to update comment", error);
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;

       const deleteComment =  await Comment.findByIdAndDelete(commentId)
    
       if(!deleteComment) throw new ApiError(404, "comment not found")

       return res
       .status(200)
       .json(new ApiResponse(200,deleteComment,"comments deleted successfully"))

    } catch (error) {
    throw new ApiError(404, {error:"failed to delete comment"} );
  }
});

export { getVideoComments, addComment, updateComment, deleteComment };
