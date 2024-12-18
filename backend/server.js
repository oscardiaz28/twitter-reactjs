import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser'
import { v2 as cloudinary } from 'cloudinary'
import path from 'path'

import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import postRoutes from './routes/post.routes.js'
import notificationRoutes from './routes/notification.routes.js'
import cors from 'cors'

dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const app = express()
const corsOptions = {
    origin: 'http://localhost:3000',  // Especifica el origen permitido (frontend)
    credentials: true,                // Permite que las cookies sean enviadas
};
app.use(cors(corsOptions))

app.use(morgan('dev'))
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cookieParser())

const __dirname = path.resolve()

console.log(__dirname)

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/notifications", notificationRoutes)

if(true){
    app.use(express.static(path.join(__dirname, "/frontend/dist")))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})

