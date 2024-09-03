import {Router} from 'express'
import {verfiyJWT} from '../middlewares/auth.middleware.js'

import {
    toggleSubscription, 
    getUserChannelSubscribers, 
    getSubscribedChannels
} from "../controllers/subscription.controller.js"

const router = Router()

router.use(verfiyJWT);

router
    .route("/c/:channelId")
    .get(getSubscribedChannels)
    .post(toggleSubscription);

router.route("/u/:subscriberId").get(getUserChannelSubscribers);

export default router