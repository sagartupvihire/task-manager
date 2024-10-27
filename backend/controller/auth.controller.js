import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const signUp = async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    const newPassword = await bcrypt.hash(password, 10);
    try {
        const user = new User({
            name,
            email,
            password: newPassword
        });
        const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: "3d" });
        res.cookie("task-manager-token", token, { httpOnly: true, sameSite: "strict", secure: true,maxAge: 1000 * 60 * 60 });
        await user.save();
        
        res.status(201).json({ user: user._id });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {    
        return res.status(400).json({ message: "User not found" });

    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(400).json({ message: "Incorrect password" });
    }   

    const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: "3d" });
    res.cookie("task-manager-token", token, { httpOnly: true, sameSite: "strict", secure: true });
    
    res.send("Login");
}


 export const logout = (req, res) => {
    console.log("Logout");
    
    res .clearCookie("task-manager-token");
    res.send("Logout");
}

export const me = async (req, res) => {
    try {
		res.json(req.userId);
	} catch (error) {
		console.error("Error in getCurrentUser controller:", error);
		res.status(500).json({ message: "Server error " });
	}
}