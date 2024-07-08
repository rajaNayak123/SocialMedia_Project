import { asyncHandler } from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import User from '../models/user.model.js'
import uploadCloudinary from '../utils/cloudinary.js'
import ApiResponse from '../utils/ApiResponse.js'

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


    // taking details from frontend 
    const { fullname, email, password, username } = res.body;
    console.log("email: " + email); // checking what i get


    // validation check the fields are empty or not

    // this some method check the element pass the test
    // method returns true (and stops) if the function returns true for one of the array elements.
    // method returns false if the function returns false for all of the array elements.
    if ([fullname, email, password, username].some((fild) => { fild?.trim() === "" })) {
        throw new ApiError(400, "Field are required")
    }

    // checking the user are already exist or not . 

    //the user provide mongoose then we can compare them by using findOne/find methods
    // the unique fields are username and email so we can check anyone 
    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User already exist")
    }

    // handle the files

    // this files provide multer
    const avtarLoclapath = req.files?.avatar[0]?.path;
    const coverImageLocalpath = req.files?.coverImage[0]?.path

    if (!avtarLoclapath) {
        throw new ApiError(400, "avatar file is required")
    }

    // upload the image and avatar into the cloudinary

    const cloudAvtar = await uploadCloudinary(avtarLoclapath);
    const cloudImage = await uploadCloudinary(coverImageLocalpath);

    if (!cloudAvtar) {
        throw new ApiError(400, "avatar file is required")
    }

   const user = await User.create({
        fullname,
        cloudAvtar: avatar.url,
        cloudImage: cloudImage.url || "",
        email,
        password,
        username : username.toLowerCase(),
    })

    // remove the password and refresh toke using select method it take unnecessary fields
    const userCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    
    if(!userCreated){
        throw new ApiError(500, "something went wrong during registreing user")
    }

    return res.status(201).json(
        new ApiResponse(201,userCreated, "user registered successfully")
    )
})

export { registerUser };