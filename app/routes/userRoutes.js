import express from 'express';
const router = express.Router();
import userController from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

router.get('/users', userController.createUser);
// Add routes that require authentication middleware here
// router.get('/users/:id', isAuthenticated, userController.getUser);

export default router;
