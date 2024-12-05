import User from "../models/user.model.js"
import jwt from 'jsonwebtoken'

const checkAuth = async (req, res, next) => {
    // const token = req.cookies.jwt
    let token = req.headers["authorization"]

    if(!token || !token.startsWith("Bearer") ){
        return res.status(400).json({error: "Unauthorized: No token provided"})
    }

    token = token.split(" ")[1]

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId).select("-password")

        req.user = user
        next()

    }catch(error){
        res.status(400).json({
            error: "Invalid token"
        })
    }
}

export default checkAuth