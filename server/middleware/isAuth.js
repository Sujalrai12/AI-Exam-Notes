import jwt from "jsonwebtoken"

const isAuth = async(req,res,next) =>{
    try{
        let{token} = req.cookies
        if(!token){
            return res.status(401).json({message:"Your session has expired. Please sign in again."})
        }
        let verifytoken =  jwt.verify(token, process.env.JWT_SECRET)
        if(!verifytoken){
            return res.status(401).json({message:"Your session is invalid. Please sign in again."})
        }
        req.userId = verifytoken.userId
        next()
        }
    catch(error){
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({message:"Your session has expired. Please sign in again."})
        }
        return res.status(500).json({message:"Authentication failed. Please try again."})

    }
}
export default isAuth
