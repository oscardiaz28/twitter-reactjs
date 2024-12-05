import mongoose from "mongoose";

const connectDB = async () => {
    try{
        const uri = process.env.MONGO_URI
        const conn = await mongoose.connect(uri)
        console.log("MongoDB connected")

    }catch(error){
        console.log(`Error connection to mongoDB: ${error.message}`)
    }
}

export default connectDB