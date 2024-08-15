// require('dotenv').config({path:'./env'})

import connectDB from './db/index.js';
import {app} from './app.js';
import dotenv from "dotenv"
dotenv.config({path: './.env'}) // what is dotenv

// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const envFilePath = join(__dirname, "../.env")
// dotenv.config({path: envFilePath})


connectDB().then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server started on port ${process.env.PORT}`)
    })
}).catch((err) => {
    console.log("server connection error: " + err);
})