import express from "express";
import { login, signUp, logout, me } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signUp);
router.post("/logout",  logout);
router.get("/me", protectRoute, me);

export default router;