import express from 'express';
import { getModules , getModulesByCourse } from '../controllers/moduleController.js';
import { getResourcesByModule } from '../controllers/resourceController.js';

const router = express.Router();

router.get('/', getModules);
router.get('/:moduleId/resources', getResourcesByModule);

export default router;