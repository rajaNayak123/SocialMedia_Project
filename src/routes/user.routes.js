import { Router } from "express"
import {
    logOut,
    loginUser,
    refreshAccessToken,
    registerUser,
    updateUserAccountDetails,
    getCurrentUser,
    changeCurrentPassword,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
} from '../controllers/user.controller.js'
import { upload } from '../middlewares/multer.middlewares.js' // handle for the file
import { verfiyJWT } from '../middlewares/auth.middleware.js'


const router = Router();
router.route('/register').post(
    // middlewares
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
    )
router.route('/login').post(loginUser)

// secured routes
router.route('/logout').post(verfiyJWT, logOut)

router.route('/refreshToken').post(refreshAccessToken)

router.route('/change-password').post(verfiyJWT, changeCurrentPassword)

router.route('/current-user').get(verfiyJWT, getCurrentUser)

router.route('/update-account').patch(verfiyJWT, updateUserAccountDetails)

router.route('/avatar').patch(verfiyJWT, upload.single("avatar"), updateUserAvatar)

router.route('/cover-image').patch(verfiyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route('/c/:username').get(verfiyJWT, getUserChannelProfile)

router.route('/watchhistory').get(verfiyJWT, getWatchHistory)

export default router;