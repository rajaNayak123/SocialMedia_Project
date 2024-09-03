import {Router} from 'express';
import {
    getChannelStats, 
    getChannelVideos
} from "../controllers/dashboard.controller.js"

import {verfiyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verfiyJWT); // Apply verifyJWT middleware to all routes in this file

router.route('/state').get(getChannelStats)
router.route('/videos').get(getChannelVideos)

export default router
