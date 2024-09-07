import { Router } from "express";
import { 
    getVideoComments, 
    addComment, 
    updateComment, 
    deleteComment
} from "../controllers/comment.controller.js";
import { verfiyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verfiyJWT)

router.route("/:videoId").get(getVideoComments).post(addComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router;