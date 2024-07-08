import mongoose from "mongoose";
import { DB_NAME } from '../constants.js'
const connectDB = async () => {
    try {
        console.log(process.env.MONGODB_URL)
         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export default connectDB;