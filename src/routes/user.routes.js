import { Router } from "express"
import { registerUser } from '../controllers/user.controller.js'
import { upload } from '../middlewares/multer.middlewares.js' // handle for the file

const router = Router();
router.route('/register').post(
    upload.fields(  // this field method take a array
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ),
    registerUser
)

export default router;