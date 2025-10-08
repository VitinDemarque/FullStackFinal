import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/httpErrors';

/**
 * Middleware 404 simples.
 */
export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({
    error: {
      message: 'Route not found',
      statusCode: 404,
    },
  });
}

/**
 * Middleware central de tratamento de erros.
 * Converte erros conhecidos em respostas JSON consistentes.
 */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // AppError conhecido
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        statusCode: err.statusCode,
        details: err.details ?? undefined,
      },
    });
  }

  // Erros do Mongoose (validação/duplicidade/etc.)
  // Sem importar tipos do mongoose para manter middleware agnóstico.
  const anyErr = err as any;

  // ValidationError (Mongoose)
  if (anyErr?.name === 'ValidationError') {
    return res.status(400).json({
      error: {
        message: 'Validation error',
        statusCode: 400,
        details: serializeMongooseValidation(anyErr),
      },
    });
  }

  // Duplicate key error
  if (anyErr?.code === 11000) {
    return res.status(409).json({
      error: {
        message: 'Duplicate key',
        statusCode: 409,
        details: anyErr?.keyValue ?? undefined,
      },
    });
  }

  // JWT erros comuns (se forem propagados)
  if (anyErr?.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: {
        message: 'Invalid token',
        statusCode: 401,
      },
    });
  }
  if (anyErr?.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: {
        message: 'Token expired',
        statusCode: 401,
      },
    });
  }

  // Fallback 500
  const message = anyErr?.message ?? 'Internal Server Error';
  console.error('[errorHandler]', anyErr);
  return res.status(500).json({
    error: {
      message,
      statusCode: 500,
    },
  });
}

/** Serializa ValidationError do Mongoose em formato mais amigável. */
function serializeMongooseValidation(error: any) {
  const details: Record<string, string> = {};
  if (error?.errors && typeof error.errors === 'object') {
    for (const [path, e] of Object.entries<any>(error.errors)) {
      details[path] = e?.message ?? 'Invalid';
    }
  }
  return details;
}