import { asyncHandler } from '../utils/asyncHandler.js'
const registerUser = asyncHandler(async (res, req) => {
    // res.send(200).json({ message: "ok" })

    // get user details from frontend
    // validation - check empty or not
    // check if user already exists : username, email
    // check for images and avtar
    // upload the images and avtar into the cloudinary
    // create the user object : create entry in db
    // remove the password and refresh token field from response
    // check user creation completed or not
    // return the res.
 

        
})

export { registerUser };