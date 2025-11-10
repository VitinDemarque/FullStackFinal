import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/httpErrors';

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({
    error: {
      message: 'Route not found',
      statusCode: 404,
    },
  });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        statusCode: err.statusCode,
        details: err.details ?? undefined,
      },
    });
  }

  const anyErr = err as any;

  if (anyErr?.name === 'CastError') {
    return res.status(400).json({
      error: {
        message: `Invalid ${anyErr.kind}: ${anyErr.value}`,
        statusCode: 400,
        details: {
          path: anyErr.path,
          value: anyErr.value,
          kind: anyErr.kind
        },
      },
    });
  }

  if (anyErr?.name === 'ValidationError') {
    return res.status(400).json({
      error: {
        message: 'Validation error',
        statusCode: 400,
        details: serializeMongooseValidation(anyErr),
      },
    });
  }

  if (anyErr?.code === 11000) {
    return res.status(409).json({
      error: {
        message: 'Duplicate key',
        statusCode: 409,
        details: anyErr?.keyValue ?? undefined,
      },
    });
  }

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

  // Handle payload too large (body-parser/raw-body)
  if (anyErr?.status === 413 || anyErr?.type === 'entity.too.large') {
    return res.status(413).json({
      error: {
        message: 'Payload demasiado grande. Envie imagens até 5MB.',
        statusCode: 413,
        details: {
          limit: anyErr?.limit,
          length: anyErr?.length,
        },
      },
    });
  }

  const message = anyErr?.message ?? 'Internal Server Error';
  console.error('[errorHandler]', anyErr);
  return res.status(500).json({
    error: {
      message,
      statusCode: 500,
    },
  });
}

function serializeMongooseValidation(error: any) {
  const details: Record<string, string> = {};
  if (error?.errors && typeof error.errors === 'object') {
    for (const [path, e] of Object.entries<any>(error.errors)) {
      details[path] = e?.message ?? 'Invalid';
    }
  }
  return details;
}