import Notification from "../models/notification.model.js"
import User from "../models/user.model.js"

export const getNotifications = async (req, res) => {
    try{
        const userId = req.user._id
        const notifications = await Notification.find({ to: userId })
        .populate({
            path: "from",
            select: "username profileImg"
        })

        await Notification.updateMany({to: userId}, {read: true})

        res.json(notifications)

    }catch(error){
        console.log(`Error in getNotifications: ${error.message}`)
        res.status(500).json({error: error.message})
    }
}

export const deleteNotifications = async (req, res) => {
    try{
        const userId = req.user._id
        
        await Notification.deleteMany({to: userId})

        res.json({message: "Notifications deleted successfully"})
        
    }catch(error){
        console.log(`Error in deleteNotifications: ${error.message}`)
        res.status(500).json({error: error.message})
    }
}