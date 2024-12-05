import express from 'express'
import { getMe, login, logout, signup } from '../controllers/auth.controller.js'
import checkAuth from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.get("/me", checkAuth, getMe)

export default router