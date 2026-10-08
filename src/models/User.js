import mongoose from "mongoose";
import bcrypt from "bcrypt"

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


userSchema.pre('save' , async function () {
    if(!this.isModified("password")){
        return 
    }
    this.password = await bcrypt.hash(this.password , 12);

})

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema)


export default User;