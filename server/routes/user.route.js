import express from "express"
import isAuth from "../middleware/isAuth.js"
import { changePassword, getCurrentUser, updateProfile } from "../controllers/user.controller.js"

const userRouter = express.Router()


userRouter.get("/currentuser", isAuth ,getCurrentUser)
userRouter.put("/profile", isAuth, updateProfile)
userRouter.put("/password", isAuth, changePassword)

export default userRouter
