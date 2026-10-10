import express from "express"
import isAuth from "../middleware/isAuth.js"
import { generateNotes, generateQuickQuiz } from "../controllers/generate.controller.js"
import { deleteNote, getMyNotes, getSingleNotes } from "../controllers/notes.controller.js"


const notesRouter = express.Router()


notesRouter.post("/generate-notes", isAuth ,generateNotes)
notesRouter.post("/:id/quick-quiz", isAuth, generateQuickQuiz)
notesRouter.get("/getnotes", isAuth,getMyNotes)
notesRouter.delete("/:id", isAuth, deleteNote)
notesRouter.get("/:id", isAuth, getSingleNotes)

export default notesRouter
