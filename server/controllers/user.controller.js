import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto"
import { promisify } from "node:util"
import UserModel from "../models/user.model.js"

const scrypt = promisify(scryptCallback)
const passwordMinLength = 8
const passwordMaxLength = 128

const serializeUser = (user) => {
    const data = user.toObject()
    data.hasPassword = Boolean(data.passwordHash)
    delete data.passwordHash
    return data
}

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

export const getCurrentUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).select("+passwordHash")
        if (!user) return res.status(404).json({ message: "Current user is not found" })
        return res.status(200).json(serializeUser(user))
    } catch (error) {
        return res.status(500).json({ message: `getCurrentUser ${error}` })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const name = typeof req.body.name === "string" ? req.body.name.trim() : ""
        if (!name) return res.status(400).json({ message: "Name is required" })
        if (name.length > 80) return res.status(400).json({ message: "Name must be 80 characters or fewer" })

        const user = await UserModel.findByIdAndUpdate(
            req.userId,
            { name },
            { new: true, runValidators: true }
        ).select("+passwordHash")
        if (!user) return res.status(404).json({ message: "Current user is not found" })
        return res.status(200).json(serializeUser(user))
    } catch (error) {
        return res.status(500).json({ message: "Profile update failed. Please try again." })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        if (typeof newPassword !== "string" || newPassword.length < passwordMinLength) {
            return res.status(400).json({ message: `Password must be at least ${passwordMinLength} characters` })
        }
        if (newPassword.length > passwordMaxLength) {
            return res.status(400).json({ message: `Password must be no more than ${passwordMaxLength} characters` })
        }

        const user = await UserModel.findById(req.userId).select("+passwordHash")
        if (!user) return res.status(404).json({ message: "Current user is not found" })

        if (user.passwordHash) {
            if (typeof currentPassword !== "string" || !currentPassword) {
                return res.status(400).json({ message: "Current password is required" })
            }
            if (!(await passwordMatches(currentPassword, user.passwordHash))) {
                return res.status(400).json({ message: "Current password is incorrect" })
            }
        }

        user.passwordHash = await hashPassword(newPassword)
        await user.save()
        return res.status(200).json({ message: "Password updated successfully", hasPassword: true })
    } catch (error) {
        return res.status(500).json({ message: "Password update failed. Please try again." })
    }
}
