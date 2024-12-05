import express from 'express'
import { followUnfollowUser, getSuggestedUsers, getUserProfile, updateUser } from '../controllers/user.controller.js'
import checkAuth from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get("/profile/:username", checkAuth, getUserProfile)
router.post("/follow/:id", checkAuth, followUnfollowUser)
router.get("/suggested", checkAuth, getSuggestedUsers)
router.post("/update", checkAuth, updateUser)

export default router