import { Request, Response, NextFunction } from 'express'
import * as TitlesService from '../services/titles.service'
import { parsePagination, toMongoPagination } from '../utils/pagination'

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parsePagination(req.query, { page: 1, limit: 100 }, 200)
    const { skip, limit } = toMongoPagination(page)
    const result = await TitlesService.list({ skip, limit })
    return res.json(result)
  } catch (err) {
    return next(err)
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const result = await TitlesService.getById(id)
    return res.json(result)
  } catch (err) {
    return next(err)
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await TitlesService.create(req.body)
    return res.status(201).json(result)
  } catch (err) {
    return next(err)
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const result = await TitlesService.update(id, req.body)
    return res.json(result)
  } catch (err) {
    return next(err)
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    await TitlesService.remove(id)
    return res.status(204).end()
  } catch (err) {
    return next(err)
  }
}