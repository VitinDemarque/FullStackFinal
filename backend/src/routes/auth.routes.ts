import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';

const router = Router();

/**
 * Auth
 * - Signup
 * - Login
 * - Refresh (se desejar)
 */
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refreshToken); // opcional

export default router;