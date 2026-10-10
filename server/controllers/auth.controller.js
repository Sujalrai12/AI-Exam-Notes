import UserModel from "../models/user.model.js"
import { getToken } from "../utils/token.js"
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto"
import { promisify } from "node:util"

const scrypt = promisify(scryptCallback)
const passwordMinLength = 8
const passwordMaxLength = 128

const normalizeEmail = (email) => email.trim().toLowerCase()

const hashPassword = async (password) => {
    const salt = randomBytes(16).toString("hex")
    const derivedKey = await scrypt(password, salt, 64)
    return `${salt}:${derivedKey.toString("hex")}`
}

const passwordMatches = async (password, passwordHash) => {
    if (!passwordHash) return false
    const [salt, storedKey] = passwordHash.split(":")
    if (!salt || !storedKey) return false
    const derivedKey = await scrypt(password, salt, 64)
    const storedBuffer = Buffer.from(storedKey, "hex")
    return storedBuffer.length === derivedKey.length && timingSafeEqual(storedBuffer, derivedKey)
}

const isProductionCookie = process.env.NODE_ENV === "production"
    || process.env.CLIENT_URL?.startsWith("https://")

const sessionCookieOptions = {
    httpOnly: true,
    secure: isProductionCookie,
    sameSite: isProductionCookie ? "none" : "lax"
}

const setSessionCookie = (res, userId) => {
    const token = getToken(userId)
    res.cookie("token", token, { ...sessionCookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
}

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (typeof name !== "string" || !name.trim() || typeof email !== "string" || !email.trim() || typeof password !== "string") {
            return res.status(400).json({ message: "Name, email, and password are required" })
        }
        if (password.length < passwordMinLength) {
            return res.status(400).json({ message: `Password must be at least ${passwordMinLength} characters` })
        }
        if (password.length > passwordMaxLength) {
            return res.status(400).json({ message: `Password must be no more than ${passwordMaxLength} characters` })
        }

        const normalizedEmail = normalizeEmail(email)
        const existingUser = await UserModel.findOne({ email: normalizedEmail })
        if (existingUser) {
            return res.status(409).json({ message: "An account with this email already exists. Please log in." })
        }

        await UserModel.create({
            name: name.trim(),
            email: normalizedEmail,
            passwordHash: await hashPassword(password)
        })
        return res.status(201).json({ message: "Account created. Please log in." })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "An account with this email already exists. Please log in." })
        }
        return res.status(500).json({ message: "Registration failed. Please try again." })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (typeof email !== "string" || !email.trim() || typeof password !== "string" || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        const user = await UserModel.findOne({ email: normalizeEmail(email) }).select("+passwordHash")
        if (!user || !(await passwordMatches(password, user.passwordHash))) {
            return res.status(401).json({ message: "Email or password is incorrect" })
        }

        setSessionCookie(res, user._id)
        const userData = user.toObject()
        delete userData.passwordHash
        return res.status(200).json(userData)
    } catch (error) {
        return res.status(500).json({ message: "Login failed. Please try again." })
    }
}

export const googleauth = async (req,res)=>{
    try{
        const {name,email} = req.body
        if (typeof email !== "string" || !email.trim()) {
            return res.status(400).json({ message: "A valid Google email is required" })
        }
        const normalizedEmail = normalizeEmail(email)
        let user = await UserModel.findOne({email: normalizedEmail})
        if(!user){
            user = await UserModel.create({name: typeof name === "string" && name.trim() ? name.trim() : normalizedEmail, email: normalizedEmail})
        }
        setSessionCookie(res, user._id)
        return res.status(200).json(user)
    }
    catch(error){
        return res.status(500).json({message:`googleSignup Error ${error}`})

    }
}

export const logOut = async (req,res) => {
    try{
        res.clearCookie("token", sessionCookieOptions)
        return res.status(200).json({message:"LogOut Successfully"})
    }
    catch(error){
        return res.status(500).json({message:`Logout Error ${error}`})
    }
}
