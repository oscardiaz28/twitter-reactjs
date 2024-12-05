import Notification from "../models/notification.model.js"
import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import { v2 as cloudinary } from "cloudinary"

export const getUserProfile = async (req, res) => {
    const {username} = req.params
    try{
        const user = await User.findOne({username}).select("-password")
        
        if(!user){
            return res.status(400).json({
                error: "User not found"
            })
        }
        res.json(user)

    }catch(error){
        console.log("Error in getUserProfile: ", error.message)
        res.status(400).json({
            error: "Internal server error"
        })
    }

}

export const followUnfollowUser = async (req, res) => {
    const {id} = req.params
    try{
        const userToModifiy = await User.findById(id)
        const currentUser = await User.findById(req.user._id)

        if( id === req.user._id.toString() ){
            return res.status(400).json({
                error: "You can't follow/unfollow yourself"
            })
        }

        if( !userToModifiy || !currentUser ){
            return res.status(400).json({
                error: "User not found"
            })
        }

        const isFollowing = currentUser.following.includes(id)
        if(isFollowing){
            //unfollow the user
            await User.findOneAndUpdate( {_id: id}, {$pull: {followers: req.user._id} })
            await User.findOneAndUpdate( {_id: req.user._id}, {$pull: {following: id}})
            // TODO: return the id of the user as a response
            res.status(200).json({message: "User unfollowed successfully"})

        }else{
            //follow the user
            await User.findOneAndUpdate( {_id: id}, {$push: {followers: req.user._id} })
            await User.findOneAndUpdate( {_id: req.user._id}, {$push: {following: id}})
            //send notification to the user
            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: userToModifiy._id
            })
            await newNotification.save()
            // TODO: return the id of the user as a response
            res.json({messsage: "User followed successfully"})
        }

    }catch(error){
        console.log("Error in followUnfollowUser: ", error.message)
        res.status(500).json({
            error: error.message
        })
    }
}

export const getSuggestedUsers = async (req, res) => {
    try{
        const userId = req.user._id
        const userFollowedByMe = await User.findById(userId).select("following")
        const users = await User.aggregate([
            {
                $match: {
                    // $ne -> operador not equal, seleccionar documentos donde el campo _id no es igual al valor de userId
                    _id: { $ne: userId}
                    // $nin -> operador not in, seleccionar documentos donde el campo _id no esta en la lista de following
                }
            },
            { $sample: { size: 10} }
        ])

        const filteredUsers = users.filter( (user) => !userFollowedByMe.following.includes(user._id) )
        const suggestedUsers = filteredUsers.slice(0, 4)
        
        suggestedUsers.forEach( (user) => (user.password = null))

        res.json(suggestedUsers)

    }catch(error){
        console.log("Error in getSuggestedUsers: ", error.message)
        res.status(500).json({error: error.message})
    }
}

export const updateUser = async (req, res) => {
    const {fullname, email, username, currentPassword, newPassword, bio, link} = req.body
    let {profileImg, coverImg} = req.body

    const userId = req.user._id

    try{
        let user = await User.findById(userId)
        if(!user) return res.status(400).json({error: "User not found"})

        if( (!newPassword && currentPassword) || (!currentPassword && newPassword) ){
            return res.status(400).json({error: "Please provide both current password and new password"})
        }

        if(currentPassword && newPassword){
            const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password)
            if( !isPasswordCorrect) return res.status(400).json({error: "Current password is incorrect"})
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(newPassword, salt)
        }

        if(profileImg){
            if(user.profileImg){
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
            }
            const uploadedResponse = await cloudinary.uploader.upload(profileImg)
            profileImg = uploadedResponse.secure_url
        }

        if(coverImg){
            if(user.coverImg){
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0])
            }
            const uploadedResponse = await cloudinary.uploader.upload(coverImg)
            coverImg = uploadedResponse.secure_url
        }

        user.fullname = fullname || user.fullname
        user.email = email || user.email
        user.username = username || user.username
        user.bio = bio || user.bio
        user.link = link || user.link
        user.profileImg = profileImg || user.profileImg
        user.coverImg = coverImg || user.coverImg

        user = await user.save()
        user.password = null

        return res.json(user)

    }catch(error){
        console.log("Error in updateUser: ", error.message)
        res.status(500).json({error: error.message})
    }

}