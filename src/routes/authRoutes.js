import express from 'express'

import { getProfile, login, register } from '../controllers/authController.js'
import { validate } from '../middlewares/validate.js';
import { loginSchema, registerSchema } from '../validators/authValidator.js';
import { auth } from '../middlewares/auth.js';

const route = express.Router();

route.post('/register',validate(registerSchema), register)
route.post('/login',validate(loginSchema), login)
route.get('/profile', auth, getProfile);

export default route