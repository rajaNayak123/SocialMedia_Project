import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" })) // extended mean we can pass nested objects
app.use(express.static("public"))
app.use(cookieParser())

// import routes 
import userRouter from './routes/user.routes.js'
import commentRouter from './routes/comment.routes.js'
// Declear the routes
app.use('/users', userRouter) 
app.use('/comments', commentRouter)

export { app };

