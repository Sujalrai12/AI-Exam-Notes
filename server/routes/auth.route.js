import express from "express"
import { googleauth, logOut, login, register } from "../controllers/auth.controller.js"


const authRouter = express.Router()

authRouter.post("/google",googleauth)
authRouter.post("/register",register)
authRouter.post("/login",login)
authRouter.get("/logout",logOut)

export default authRouter
