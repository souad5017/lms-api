import express from "express"

import { createCourse, getCourseById, getCourses, updateCourse } from "../controllers/courseController.js"
import { getModulesByCourse } from "../controllers/moduleController.js";
import { auth } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";

const router = express.Router();

router.get('/' , getCourses);
router.get('/:id' , getCourseById);
router.get('/:id/modules' ,getModulesByCourse);
router.post('/', auth , authorize('admin' ,'trainer') ,createCourse);
router.post('/:id', auth , authorize('admin' ,'trainer') ,updateCourse);


export default router
