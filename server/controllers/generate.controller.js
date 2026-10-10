import UserModel from "../models/user.model.js"
import { generateGeminiResponse } from "../services/gemini.services.js"
import { buildPrompt, buildQuickQuizPrompt } from "../utils/promptBuilder.js"
import Notes from "../models/notes.model.js"

export const generateNotes = async (req, res) => {
    try {
        const {
            topic,
            classLevel,
            examType,
            revisionMode = false,
            quickQuizMode = false,
            includeDiagram = false,
            includeChart = false
        } = req.body
        console.log("CLasslevel",classLevel);
        if (!topic) {
            return res.status(400).json({ message: "Topic is required" })
        }
        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.status(400).json({ message: "user is not found" })
        }
        if (user.credits < 10) {
            user.isCreditAvailable = false
            await user.save()
            return res.status(403).json({
                message: "Insufficient credits"

            })
        }
        const prompt = buildPrompt({
            topic,
            classLevel,
            examType,
            revisionMode,
            quickQuizMode,
            includeDiagram,
            includeChart
        })

        const aiResponse = await generateGeminiResponse(prompt)
        

        const notes = await Notes.create({
            user :user._id,
            topic,
            classLevel,
            examType,
            revisionMode,
            quickQuizMode,
            includeDiagram,
            includeChart,
            content :aiResponse


        })

        user.credits -=10;
        if(user.credits <=0) user.isCreditAvailable = false;

        if(!Array.isArray(user.notes)){
            user.notes =[];

        }

        user.notes.push(notes._id);

        await user.save();

        return res.status(200).json({
            data :aiResponse,
            noteId : notes._id,
            creditsLeft : user.credits
        })




    } catch (error) {
        console.error(error);
        res.status(error.statusCode || 500).json({
            error : "AI generation failed",
            message : error.message
        })

    }
}

export const generateQuickQuiz = async (req, res) => {
    try {
        const note = await Notes.findOne({ _id: req.params.id, user: req.userId })
        if (!note) {
            return res.status(404).json({ message: "Note not found" })
        }

        const existingQuiz = note.content?.quickQuiz
        if (Array.isArray(existingQuiz) && existingQuiz.length === 5) {
            return res.status(200).json({ quickQuiz: existingQuiz })
        }

        const prompt = buildQuickQuizPrompt({
            topic: note.topic,
            classLevel: note.classLevel,
            examType: note.examType,
            notes: note.content?.notes || ""
        })
        const generated = await generateGeminiResponse(prompt)
        const quickQuiz = generated?.quickQuiz
        const isValidQuiz = Array.isArray(quickQuiz)
            && quickQuiz.length === 5
            && quickQuiz.every((question) =>
                typeof question.question === "string"
                && Array.isArray(question.options)
                && question.options.length === 4
                && question.options.every((option) => typeof option === "string")
                && new Set(question.options).size === 4
                && typeof question.answer === "string"
                && question.options.includes(question.answer)
                && typeof question.explanation === "string"
            )

        if (!isValidQuiz) {
            return res.status(502).json({ message: "The quiz could not be generated in the expected format. Please try again." })
        }

        note.content = { ...note.content, quickQuiz }
        note.quickQuizMode = true
        await note.save()

        return res.status(200).json({ quickQuiz })
    } catch (error) {
        console.error(error)
        return res.status(error.statusCode || 500).json({
            message: error.message || "Quiz generation failed"
        })
    }
}
