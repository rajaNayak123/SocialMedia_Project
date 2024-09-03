import {Router} from "express"

import {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    toggleUnlikeVideo,
    getLikedVideos,
} from "../controllers/like.controller.js"

import {verfiyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verfiyJWT)  // Apply verifyJWT middleware to all routes in this file


router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/u/:videoId").post(toggleUnlikeVideo);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);

export default router