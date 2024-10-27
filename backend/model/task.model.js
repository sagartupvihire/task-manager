import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const taskSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: Boolean,
        default : false
    },
});

export default mongoose.model("Task", taskSchema);