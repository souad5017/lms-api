import express from "express"

import { getCourseById, getCourses } from "../controllers/courseController.js"
import { getModulesByCourse } from "../controllers/moduleController.js";

const router = express.Router();

router.get('/' , getCourses);
router.get('/:id' , getCourseById);
router.get('/:id/modules' ,getModulesByCourse);

export default router
