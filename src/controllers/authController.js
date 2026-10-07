import User from "../models/User.js";

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