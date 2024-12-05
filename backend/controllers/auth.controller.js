import User from "../models/user.model.js"
import { hashPassword } from "../helpers/hashPassword.js"
import { generateTokenAndSetCookie } from "../libs/utils/generateToken.js"
import bcrypt from 'bcryptjs'


export const signup = async (req, res) => {
    try{
        const {fullname, username, password, email} = req.body
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        if( !emailRegex.test(email) ){
            return res.status(400).json({error: "Invalid email format"})
        }

        const existingUser = await User.findOne({username})
        if(existingUser){
            return res.status(400).json({error: "Username is already taken"})
        }

        const existingEmail = await User.findOne({email})
        if(existingEmail){
            return res.status(400).json({error: "Email is already taken"})
        }

        const hashedPass = await hashPassword(password)

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashedPass
        })

        if( newUser ){
            const token = generateTokenAndSetCookie(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                user: {
                    _id: newUser._id,
                    fullname: newUser.fullname,
                    username: newUser.username,
                    email: newUser.email,
                    followers: newUser.followers,
                    following: newUser.following,
                    profileImg: newUser.profileImg,
                    coverImg: newUser.coverImg,
                },
                token
            })
        }else{
            res.status(400).json({error: "Invalid user data"})
        }
        
    }catch(error){
        console.log(error.message)
        res.status(500).json({error: "Internal server error"})
    }
}

export const login = async (req, res) => {    
    try{
        const {username, password} = req.body

        const user = await User.findOne({username})
        if( !user ){
            return res.status(400).json({
                error: "User not exist"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if( isPasswordCorrect ){
            const token = generateTokenAndSetCookie(user._id, res)

            res.status(200).json({
                user: {
                    _id: user._id,
                    fullname: user.fullname,
                    username: user.username,
                    email: user.email,
                    followers: user.followers,
                    following: user.following,
                    profileImg: user.profileImg,
                    coverImg: user.coverImg,
                },
                token
            })

        }else{
            const error = new Error("Invalid password")
            res.status(404).json({
                message: error.message
            })
        }

    }catch(error){
        console.log(error.message)
        res.status(500).json({error: "Internal server error"})
    }

}


export const logout = (req, res) => {
    res.cookie("jwt", "", {maxAge: 0})
    res.json({message: "Logged out successfully"})
}

export const getMe = async (req, res) => {
    const {user} = req
    res.json(user)
}