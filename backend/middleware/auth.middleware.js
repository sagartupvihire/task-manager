import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import e from "express";

export const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies["task-manager-token"];

		if (!token) {
			return res.status(401).json({ message: "Unauthorized - No Token Provided" });
		}

		const decoded = jwt.verify(token, process.env.SECRET);
		if (!decoded) {
			return res.status(401).json({ message: "Unauthorized - Invalid Token" });
		}

		const user = await User.findById(decoded.userId).select("-password");
		
		

		if (!user) {
			return res.status(401).json({ message: "User not found" });
		}

		req.userId = user._id;
        console.info(`User ${user.name} is authenticated`);

		next();
	} catch (error) {
		
		console.log("Error in protectRoute middleware:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};