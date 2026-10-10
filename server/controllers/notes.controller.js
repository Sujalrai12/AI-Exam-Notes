import  Notes  from "../models/notes.model.js";

export const getMyNotes = async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.userId }).select("topic classLevel examType revisionMode quickQuizMode includeDiagram includeChart createdAt").sort({ createdAt: -1 })
        return res.status(200).json(notes)

    } catch (error) {
        return res.status(500).json({ message: `getCurrentUser notes error ${error}` })

    }
}

export const getSingleNotes = async (req, res) => {
    try {
        const notes = await Notes.findOne({
            _id: req.params.id,
            user: req.userId
        })
        if (!notes) {
            return res.status(404).json({
                error: "Note not found"
            });
        }
        return res.json({
            _id: notes._id,
            content: notes.content,
            topic: notes.topic,
            createdAt: notes.createdAt
        })
    } catch (error) {
        return res.status(500).json({ message: `getCurrentUser notes error ${error}` })

    }
}

export const deleteNote = async (req, res) => {
    try {
        const note = await Notes.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        })

        if (!note) {
            return res.status(404).json({ error: "Note not found" })
        }

        return res.status(200).json({ message: "Note deleted" })
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ error: "Invalid note id" })
        }
        return res.status(500).json({ message: `deleteNote error ${error}` })
    }
}
