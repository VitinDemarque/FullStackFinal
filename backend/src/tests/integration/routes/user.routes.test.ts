// comando de teste para esse arquivo: npm test -- src/tests/integration/routes/user.routes.test.ts --verbose

import request from 'supertest'
import express, { Request, Response, NextFunction } from 'express'
import usersRoutes from '@/routes/users.routes'

// Cria app de teste isolado
const app = express()
app.use(express.json())

// Mocka o controller (vamos testar integração de rota, não a lógica interna)
jest.mock('@/controllers/users.controller', () => ({
    getMe: (req: Request, res: Response) => res.json({ id: 'u1', nome: 'Usuário Teste' }),
    updateMe: (req: Request, res: Response) => res.json({ success: true, ...req.body }),
    uploadMyAvatar: (req: Request, res: Response) => res.json({ avatar: 'avatar.png' }),
    changeMyPassword: (req: Request, res: Response) => res.json({ changed: true }),
    deleteMe: (req: Request, res: Response) => res.status(204).send(),
    getPublicProfile: (req: Request, res: Response) => res.json({ id: req.params.id, public: true }),
    getProfileScoreboard: (req: Request, res: Response) => res.json({ created: 5, completed: 3 }),
    getUserBadges: (req: Request, res: Response) => res.json([{ id: 'b1', name: 'Iniciante' }]),
    checkAndAwardBadges: (req: Request, res: Response) => res.json({ newBadge: true }),
    getUserTitles: (req: Request, res: Response) => res.json([{ id: 't1', name: 'Campeão' }]),
    getById: (req: Request, res: Response) => res.json({ id: req.params.id, name: 'User' }),
    updateById: (req: Request, res: Response) => res.json({ updated: true, id: req.params.id })
}))

// Mock dos middlewares de auth e requireOwnership
jest.mock('@/middlewares/auth', () => ({
    auth: () => (req: Request, res: Response, next: NextFunction) => {
        // Simula um usuário autenticado
        (req as any).user = { id: 'u1', name: 'User Test' }
        next()
    },
    requireOwnership: () => (req: Request, res: Response, next: NextFunction) => next()
}))

// Usa o router real da aplicação
app.use('/users', usersRoutes)

describe('Users Routes (integração)', () => {
    describe('Rotas do usuário autenticado', () => {
        it('GET /users/me deve retornar perfil do usuário', async () => {
            const res = await request(app).get('/users/me')
            expect(res.status).toBe(200)
            expect(res.body).toEqual(expect.objectContaining({ id: 'u1', nome: 'Usuário Teste' }))
        })

        it('PATCH /users/me deve atualizar dados', async () => {
            const res = await request(app).patch('/users/me').send({ nome: 'Novo Nome' })
            expect(res.status).toBe(200)
            expect(res.body).toMatchObject({ success: true, nome: 'Novo Nome' })
        })

        it('POST /users/me/avatar deve fazer upload do avatar', async () => {
            const res = await request(app).post('/users/me/avatar')
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('avatar', 'avatar.png')
        })

        it('POST /users/me/password deve trocar senha', async () => {
            const res = await request(app).post('/users/me/password')
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('changed', true)
        })

        it('DELETE /users/me deve excluir o usuário', async () => {
            const res = await request(app).delete('/users/me')
            expect(res.status).toBe(204)
        })
    })

    describe('Rotas públicas de perfil', () => {
        it('GET /users/:id/profile deve retornar perfil público', async () => {
            const res = await request(app).get('/users/u2/profile')
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('public', true)
        })

        it('GET /users/:id/scoreboard deve retornar scoreboard', async () => {
            const res = await request(app).get('/users/u2/scoreboard')
            expect(res.status).toBe(200)
            expect(res.body).toEqual(expect.objectContaining({ created: 5, completed: 3 }))
        })

        it('GET /users/:id/badges deve retornar badges', async () => {
            const res = await request(app).get('/users/u2/badges')
            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
            expect(res.body[0]).toHaveProperty('name', 'Iniciante')
        })

        it('POST /users/:id/badges/check deve checar e conceder badge', async () => {
            const res = await request(app).post('/users/u2/badges/check')
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('newBadge', true)
        })

        it('GET /users/:id/titles deve retornar títulos', async () => {
            const res = await request(app).get('/users/u2/titles')
            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
            expect(res.body[0]).toHaveProperty('name', 'Campeão')
        })
    })

    describe('Rotas autenticadas com ID específico', () => {
        it('GET /users/:id deve retornar o usuário pelo ID', async () => {
            const res = await request(app).get('/users/u3')
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('id', 'u3')
        })

        it('PATCH /users/:id deve atualizar o usuário (owner)', async () => {
            const res = await request(app).patch('/users/u3').send({ nome: 'Atualizado' })
            expect(res.status).toBe(200)
            expect(res.body).toMatchObject({ updated: true, id: 'u3' })
        })
    })
})