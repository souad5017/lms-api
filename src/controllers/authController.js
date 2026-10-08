import User from "../models/User.js";
import jwt from "jsonwebtoken"

export async function register(req, res, next) {
    try {
        const { name, email, password } = req.body
        const user = await User.create({
            name,
            email,
            password,
            role: "learner",
            status: "active"
        })

        res.status(201).json({
            message: "User registered successfully",
            user
        })
    } catch (error) {
        next(error);
    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');


        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }
        if (user.status === 'disabled') {
            return res.status(403).json({
                message: "Account is disabled"
            })
        }
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password"
            })
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" })

        res.status(200).json({
            message: "Login successful", token
        })
    }
    catch (err) {
        next(err)
    }

}