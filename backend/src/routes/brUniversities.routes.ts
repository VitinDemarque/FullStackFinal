import { Router } from 'express';
import * as BRUniversitiesController from '../controllers/brUniversities.controller';

const router = Router();

// Rota pública de busca (para autocomplete, sem necessidade de autenticação)
router.get('/', BRUniversitiesController.search);

export default router;