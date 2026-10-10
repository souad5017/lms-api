
import jwt from "jsonwebtoken";

export function auth(req, res, next) {
    try {
        const headers = req.headers.authorization;

        if (!headers || !headers.startsWith('Bearer ')) {
           return res.status(401).json({
                message: "Token manquant ou format invalide"
            })
        }

        const token = headers.split(' ')[1];

        if (!token){
            return res.status(401).json({
                message: 'Authentication required'
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = {
            id: decoded.id,
            role: decoded.role
        }
        // console.log(req.user)

        next()
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        })
    }
}