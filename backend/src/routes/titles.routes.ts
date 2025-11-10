import { Router } from 'express'
import * as TitlesController from '../controllers/titles.controller'
import { auth } from '../middlewares/auth'

const router = Router()

// Public listing and retrieval
router.get('/', TitlesController.list)
router.get('/:id', TitlesController.getById)

// Admin-only management routes
router.post('/', auth({ roles: ['ADMIN'] }), TitlesController.create)
router.patch('/:id', auth({ roles: ['ADMIN'] }), TitlesController.update)
router.delete('/:id', auth({ roles: ['ADMIN'] }), TitlesController.remove)

export default router