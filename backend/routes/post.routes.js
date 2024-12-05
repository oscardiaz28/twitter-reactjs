import express from 'express'
import { commentOnPost, createPost, deletePost, getAllPost, getFollowingPosts, getLikedPosts, getUserPosts, likeUnlikePost } from '../controllers/post.controller.js'
import checkAuth from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get("/all", checkAuth, getAllPost)
router.get("/following", checkAuth, getFollowingPosts)
router.get("/user/:username", checkAuth, getUserPosts)
router.get("/likes/:id", checkAuth, getLikedPosts)
router.post("/create", checkAuth, createPost)
router.post("/like/:id", checkAuth, likeUnlikePost)
router.post("/comment/:id", checkAuth, commentOnPost)
router.delete("/:id", checkAuth, deletePost)

export default router