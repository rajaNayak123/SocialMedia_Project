import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs' // node js is provide fs(file system) it help to read write remove the files. here we need file path
//fs have a path unlink that used to delete the file


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET  
});


const uploadCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // file upload on cloudinary server
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        // file has been successfully uploaded on cloudinary server
        console.log("file has been uploaded", uploadResult.url);
        return uploadResult;
    } catch (error) {
        fs.unlinkSync(localFilePath)
        //remove the locally saved temporary file
        return null;
    }
}

export { uploadCloudinary }


// Upload an image
// const uploadResult = await cloudinary.uploader
//     .upload(
//         'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//         public_id: 'shoes',
//     }
//     )
//     .catch((error) => {
//         console.log(error);
//     });

// console.log(uploadResult);