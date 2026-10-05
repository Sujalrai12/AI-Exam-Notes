import express from "express";
import dotenv from "dotenv"
import connectDb from "./utils/connectDb.js";
import dns from 'dns';
import authRouter from "./routes/auth.route.js";
import cors from "cors"
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import notesRouter from "./routes/generate.route.js"
import pdfRouter from "./routes/pdf.route.js";
import creditsRouter from "./routes/credits.route.js";
import { stripeWebhook } from "./controllers/credits.controller.js";
dotenv.config()

const app = express();

app.post("/api/credits/webhook",
    express.raw({type:"application/json"}),
    stripeWebhook
)

app.use(express.json())
app.use(cookieParser())

const allowedOrigins = [
    process.env.CLIENT_URL?.replace(/\/$/, ""),
    "https://ai-exam-notes-client-y9mw.onrender.com",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
].filter(Boolean)

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));



const PORT = process.env.PORT || 5000

dns.setServers(["1.1.1.1","8.8.8.8"])

app.get("/",(req,res)=>{
    res.send("Hello")
})

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/notes",notesRouter)
app.use("/api/pdf",pdfRouter)
app.use("/api/credit",creditsRouter)



app.listen(PORT,()=>{
    console.log(`Listening to ${PORT}`)
    connectDb()
})
