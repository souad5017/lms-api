
import jwt from "jsonwebtoken";

export function auth(req, res, next) {
    try {
        const headers = req.headers.authorization;

        if (!headers || !headers.startsWith('Bearer ')) {
            res.status(401).json({
                message: "Token manquant ou format invalide"
            })
        }

        const token = headers.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = {
            id: req.id,
            role: req.role
        }

        next()
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        })
    }
}