import { z } from 'zod';

export const createCourseSchema = z.object({
    title: z.string().trim()
        .min(3, 'Title must contain at least 3 characters').max(100, 'Title cannot exceed 100 characters'),

    description: z.string().trim()
        .min(10, 'Description must contain at least 10 characters'),
    objectives: z.array(z.string()).optional(),
    level: z.string().min(1, 'Level required'),
    category: z.string().trim().min(1, 'Category is required'),
    duration: z.number().min(1, 'Duration must be at least 1'),
});

export const updateCourseSchema = createCourseSchema.partial();