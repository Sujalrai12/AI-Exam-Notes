import mongoose from "mongoose"

const userschema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    credits:{
        type:Number,
        default:50,
        min:0
    },
    isCreditAvailable:{
        type:Boolean,
        default:true
    },
    notes:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Notes",
        default:[]
    }
},{timestamps:true})


const UserModel = mongoose.model("UserModel", userschema)

export default UserModel
