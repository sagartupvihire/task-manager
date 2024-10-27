import express from "express";

import { getTask, addTask, deleteTask, updateTask } from "../controller/task.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();


router.get("/gettask", protectRoute,getTask);
router.post("/addtask",protectRoute, addTask);
router.post("/delete/:id", protectRoute,deleteTask);
router.post("/update/:id", protectRoute,updateTask  );


export default router;
