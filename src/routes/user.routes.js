import { Router } from "express"
import { logOut, loginUser, refreshAccessToken, registerUser } from '../controllers/user.controller.js'
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

export default router;