import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';

const router = Router();

/**
 * Auth
 * - Signup
 * - Login
 */
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);

export default router;