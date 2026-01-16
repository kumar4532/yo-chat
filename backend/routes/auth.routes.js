import express from "express";
import { getMe, login, logout, signup, updateUserName, updateUserProfilePic } from "../controllers/auth.controller.js";
import protectedRoute from "../middlewares/protectedRoute.js"
import { upload } from '../middlewares/multer.middleware.js'

const router = express.Router();

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

router.get("/me", protectedRoute, getMe)

router.post("/edit/pic", protectedRoute, upload.single("profilePic"), updateUserProfilePic)

router.post("/edit/name", protectedRoute, updateUserName)

export default router;