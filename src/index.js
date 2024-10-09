// require('dotenv').config({path:'./env'})
import connectDB from './db/index.js';
import {app} from './app.js';
import dotenv from "dotenv"
dotenv.config({path: './.env'}) // when server started then quickly .env variables accessible


connectDB().then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server started on port ${process.env.PORT}`)
    })
}).catch((err) => {
    console.log("server connection error: " + err);
})