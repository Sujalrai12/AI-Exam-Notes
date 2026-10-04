import express from "express"
import { googleauth,logOut } from "../controllers/auth.controller.js"


const authRouter = express.Router()

authRouter.post("/google",googleauth)
authRouter.get("/logout",logOut)

export default authRouter