import { Router } from "express";

import { 
    getVideoComments, 
    addComment, 
    updateComment, 
    deleteComment
} from "../controllers/comment.controller.js";

import { verfiyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/comments').post(addComment);
router.route('/:videoId').get(getVideoComments).post(updateComment)
router.route('/:commentId').delete(deleteComment).patch(updateComment);

export default router;