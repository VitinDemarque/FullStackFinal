import { Router } from 'express';
import * as Judge0Controller from '../controllers/judge0.controller';

const router = Router();

router.post('/', Judge0Controller.execute);

export default router;