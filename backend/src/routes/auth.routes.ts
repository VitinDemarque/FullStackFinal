import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
import { auth } from '../middlewares/auth';

const router = Router();

/**
 * Auth
 * - Signup
 * - Login
 * - Refresh
 * - Logout
 * - Logout All (requer autenticação)
 */
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refreshToken);
router.post('/logout', AuthController.logout);
router.post('/logout-all', auth(), AuthController.logoutAll);

export default router;