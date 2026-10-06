import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        objectives: {
            type: [String],
            default: [],
        },

        level: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            required: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        duration: {
            type: Number,
            required: true,
            min: 0,
        },

        status: {
            type: String,
            enum: ['draft', 'published' , 'archived'],
            default: 'draft',
        },

        trainer: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
            required: true,
        },

        publishedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;