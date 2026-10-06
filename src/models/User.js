import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,

    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        trim: true,
        required: true,
        enum: ['learner', 'trainer', 'admin'],

    },
    status: {
        type: String,
        trim: true,
        required: true,
        enum: ['active', 'disabled'],
    }
}, {timestamps: true})

const User = mongoose.model('User', userSchema)


export default User;