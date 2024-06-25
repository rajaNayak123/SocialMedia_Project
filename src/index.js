// require('dotenv').config({path:'./env'})

import dotenv from 'dotenv'
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import connectDB from "./db";
import { app } from './app';

dotenv.config({ path: './env' })


connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log("server started on port " + `${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log("server connection error: " + err);
    })