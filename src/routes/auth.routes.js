import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes
router.get('/profile', authenticate, AuthController.getProfile);
router.put('/username', authenticate, AuthController.updateUsername);
router.post('/change-password', authenticate, AuthController.changePassword);

export default router;
