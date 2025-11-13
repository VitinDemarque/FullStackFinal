import { Request, Response, NextFunction } from 'express';
import * as Judge0Service from '../services/judge0.service';
import { BadRequestError } from '../utils/httpErrors';

export async function execute(req: Request, res: Response, next: NextFunction) {
  try {
    const { sourceCode, languageId } = req.body ?? {};

    if (!sourceCode || typeof sourceCode !== 'string') {
      throw new BadRequestError('sourceCode é obrigatório e deve ser uma string');
    }

    if (!languageId || typeof languageId !== 'number') {
      throw new BadRequestError('languageId é obrigatório e deve ser um número');
    }

    const result = await Judge0Service.executarCodigo(sourceCode, languageId);

    if (!result.sucesso) {
      return res.status(500).json({
        error: {
          message: 'Erro na execução do código',
          statusCode: 500,
          details: {
            resultado: result.resultado,
          },
        },
      });
    }

    return res.status(200).json({
      sucesso: result.sucesso,
      resultado: result.resultado,
    });
  } catch (err) {
    return next(err);
  }
}