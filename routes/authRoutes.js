import express from 'express'

import { register, login } from '../controllers/authController.js';

// Instance of express router method
const router = express.Router();

//Routes
router.route('/register')
    .post(register)
router.route('/login')
    .post(login)



export default router