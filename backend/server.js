import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import authRoute from "./routes/auth.routes.js";
import taskRoute from "./routes/task.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();




const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,


}));
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/auth", authRoute);
app.use("/task", taskRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
    connectDB();
    });