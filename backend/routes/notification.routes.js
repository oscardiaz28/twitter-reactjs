import express from 'express'
import { deleteNotifications, getNotifications } from '../controllers/notification.controller.js'
import checkAuth from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get("/", checkAuth, getNotifications)
router.delete("/", checkAuth, deleteNotifications)

export default router