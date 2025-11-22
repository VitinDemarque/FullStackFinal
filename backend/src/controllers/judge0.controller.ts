import { Request, Response, NextFunction } from 'express';
import * as Judge0Service from '../services/judge0.service';
import { BadRequestError } from '../utils/httpErrors';

export async function execute(req: Request, res: Response, next: NextFunction) {
  try {
    const { sourceCode, languageId, input } = req.body ?? {};

    if (!sourceCode || typeof sourceCode !== 'string') {
      throw new BadRequestError('sourceCode é obrigatório e deve ser uma string');
    }

    if (languageId === undefined || languageId === null || typeof languageId !== 'number') {
      throw new BadRequestError('languageId é obrigatório e deve ser um número');
    }

    // Se tiver input, usa executarCodigoComInput, senão usa executarCodigo
    const result = input !== undefined && input !== null
      ? await Judge0Service.executarCodigoComInput(sourceCode, languageId, String(input))
      : await Judge0Service.executarCodigo(sourceCode, languageId);

    if (!result.sucesso) {
      // Se for erro de API não configurada, retorna 503 (Service Unavailable)
      if (result.resultado?.includes('API de compilação não configurada') || result.error?.includes('API de compilação não configurada')) {
        return res.status(503).json({
          error: {
            message: 'Serviço de compilação não configurado',
            statusCode: 503,
            details: {
              resultado: result.resultado || result.error,
              error: 'Configure a variável de ambiente JUDGE0_API_KEY. Veja SOLUCAO_ERRO_500.md para mais detalhes.',
            },
          },
        });
      }

      return res.status(500).json({
        error: {
          message: 'Erro na execução do código',
          statusCode: 500,
          details: {
            resultado: result.resultado || result.error,
            error: result.error || result.compileError,
          },
        },
      });
    }

    return res.status(200).json({
      sucesso: result.sucesso,
      resultado: result.resultado,
    });
  } catch (err) {
    console.error('[judge0.controller] Erro ao executar código:', err);
    return next(err);
  }
}