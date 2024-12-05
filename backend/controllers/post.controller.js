import Notification from "../models/notification.model.js"
import Post from "../models/post.model.js"
import User from "../models/user.model.js"
import { v2 as cloudinary } from "cloudinary"

export const createPost = async (req, res) => {
    const {text} = req.body
    let {img} = req.body
    const userId = req.user._id.toString()

    try{
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({error: "User not found"})
        }

        if(!text && !img){
            return res.status(400).json({error: "Post must have text or image"})
        }

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img)
            img = uploadedResponse.secure_url
        }

        const newPost = new Post({
            user: userId,
            text,
            img
        })

        await newPost.save()

        res.json(newPost)

    }catch(error){
        console.log("Error in createPost: ", error.message)
        res.status(500).json({
            error: "Error: " + error.message
        })
    }
    
}

export const likeUnlikePost = async (req, res) => {
    const {id: postId} = req.params
    const userId = req.user._id.toString()

    try{
        const post = await Post.findById(postId)
        if(!post){
            return res.status(400).json({error: "Post not found"})
        }

        const userLikedPost = post.likes.includes(userId)

        if(userLikedPost){
            //unlike post
            await Post.updateOne({_id: postId}, {$pull: {likes: userId}})
            await User.updateOne({_id: userId}, {$pull: {likedPosts: postId}})

            const updatedLikes = post.likes.filter( (id) => id.toString() !== userId.toString() )
            res.json( {message: "Post unliked successfully", likes: updatedLikes} )

        }else{
            //like post 
            post.likes.push(userId)
            await User.updateOne({_id: userId}, {$push: {likedPosts: postId}})
            await post.save()
            
            const notification = new Notification({
                from: userId,
                to: post.user._id,
                type: "like"
            })

            await notification.save()
            console.log("Like notification sended")
            res.json( { message: "Post liked successfully", likes: post.likes } )

        }

    }catch(error){
        console.log(`Error in likeUnlikePost: ${error.message}`)
        res.status(500).json({error: error.message})
    }

}

export const commentOnPost = async (req, res) => {
    const {text} = req.body
    const {id} = req.params
    const userId = req.user._id.toString()

    try{
        if(!text){
            return res.status(400).json({error: "Text field is required"})
        }
        let post = await Post.findById(id)
        
        if(!post){
            return res.status(400).json({error: "Post not found"})
        }

        const comment = {user: userId, text}

        post.comments.push(comment)

        await post.save()

        post = await Post.findById(id)
        .populate({
            path: "comments.user",
            select: "_id username fullname email profileImg"
        })

        res.json(post)

    }catch(error){
        console.log(`Error in commentOnPost: ${error.message}`)
        res.status(500).json({error: error.message})
    }

}

export const deletePost = async (req, res) => {
    const {id} = req.params
    try{
        const post = await Post.findById(id)

        if(!post){
            return res.status(400).json({error: "Post not found"})
        }

        if( post.user.toString() !== req.user._id.toString() ){
            return res.status(400).json({error: "You are not authorized to delete this post"})
        }

        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(imgId)
        }

        await post.deleteOne()

        res.json({message: "Post deleted successfully"})

    }catch(error){
        console.log("Error in detelePost: ", error.message)
        res.status(500).json({
            error: error.message
        })
    }
}

export const getAllPost = async (req, res) => {
    try{
        const posts = await Post.find().sort({createdAt: -1})
        .populate({
            path: "user",
            select: "-password"
        })
        .populate({
            path: "comments.user",
            select: "_id username fullname email profileImg"
        })

        if(posts.length == 0){
            return res.json([])
        }
        
        res.json(posts)

    }catch(error){
        console.log(`Error in getAllPost: ${error.message}`)
        res.status(500).json({error: error.message})
    }
}


export const getLikedPosts = async (req, res) => {
    const userId = req.params.id
    try{
        const user = await User.findById(userId)
        if(!user){
            return res.status(400).json({error: "User not found"})
        }
        const likedPosts = await Post.find({_id: {$in: user.likedPosts}})
        .populate({
            path: "user",
            select: "-password"
        })
        .populate({
            path: "comments.user",
            select: "-password"
        })

        res.json(likedPosts)

    }catch(error){
        console.log(`Error in getLikedPost: ${error.message}`)
        res.status(500).json({error: error.message})
    }

}


export const getFollowingPosts = async (req, res) => {
    const userId = req.user._id
    try{
        const user = await User.findById(userId)
        if(!user) return res.status(400).json({error: "User not found"})

        const following = user.following

        const feedPosts = await Post.find({user: {$in: following}})
        .sort({createdAt: -1})
        .populate({
            path: "user",
            select: "-password"
        })
        .populate({
            path: "comments.user",
            select: "-password"
        })

        res.json(feedPosts)

    }catch(error){
        console.log(`Error in getFollowingPosts: ${error.message}`)
        res.status(500).json({error: error.message})
    }
   
} 

export const getUserPosts = async (req, res) => {
    const {username} = req.params

    try{
        const user = await User.findOne({username})
        if(!user) return res.status(400).json({error: "User not found"})
        
        const posts = await Post.find({ user: user._id })
        .sort({createdAt: -1})
        .populate({
            path: "user",
            select: "-password"
        })
        .populate({
            path: "comments.user",
            select: "-password"
        })

        res.json(posts)

    }catch(error){
        console.log(`Error in getUserPosts: ${error.message}`)
        res.status(500).json({error: error.message})
    }

}