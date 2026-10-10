import mongoose from "mongoose"

const notesSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required :true
    },
    topic:{
        type:String,
        required :true
    },

    classLevel :{
        type: String,
        requried :true
    },
    examType : String,

    revisionMode :{
        type :Boolean,
        default :false

    },
    quickQuizMode :{
        type :Boolean,
        default :false
    },
    includeDiagram :Boolean,
    includeChart :Boolean,

    content :{
        type : mongoose.Schema.Types.Mixed,
        required :true
    }

},{timestamps:true})

const Notes = mongoose.model("Notes", notesSchema)

export default Notes
