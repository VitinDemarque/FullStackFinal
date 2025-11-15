import type { ApiError } from '../types'

export interface ErrorHandlerResult {
  message: string
  title: string
  canRetry: boolean
}

export function handleApiError(error: any): ErrorHandlerResult {
  if (!navigator.onLine) {
    return {
      title: 'Sem Conexão',
      message: 'Verifique sua conexão com a internet e tente novamente.',
      canRetry: true,
    }
  }

  if (error.code === 'ECONNREFUSED' || error.statusCode === 0 || error.code === 'ECONNABORTED') {
    return {
      title: 'Servidor Indisponível',
      message: 'Não foi possível conectar ao servidor. Tente novamente em alguns instantes.',
      canRetry: true,
    }
  }

  const apiError = error as ApiError

  switch (apiError.statusCode) {
    case 400:
      return {
        title: 'Dados Inválidos',
        message: apiError.message || 'Por favor, verifique os dados preenchidos e tente novamente.',
        canRetry: false,
      }

    case 401:
      return {
        title: 'Não Autorizado',
        message: 'E-mail ou senha incorretos. Por favor, tente novamente.',
        canRetry: false,
      }

    case 403:
      return {
        title: 'Acesso Negado',
        message: 'Você não tem permissão para acessar este recurso.',
        canRetry: false,
      }

    case 404:
      return {
        title: 'Não Encontrado',
        message: apiError.message || 'O recurso solicitado não foi encontrado.',
        canRetry: false,
      }

    case 409:
      return {
        title: 'Conflito',
        message: apiError.message || 'Já existe um registro com estes dados.',
        canRetry: false,
      }

    case 422:
      return {
        title: 'Validação Falhou',
        message: apiError.message || 'Os dados fornecidos não são válidos.',
        canRetry: false,
      }

    case 429:
      return {
        title: 'Muitas Tentativas',
        message: 'Você fez muitas requisições. Por favor, aguarde alguns minutos.',
        canRetry: true,
      }

    case 500:
    case 502:
    case 503:
    case 504:
      return {
        title: 'Erro no Servidor',
        message: 'Ocorreu um erro no servidor. Nossa equipe já foi notificada.',
        canRetry: true,
      }

    default:
      return {
        title: 'Erro Desconhecido',
        message: apiError.message || 'Ocorreu um erro inesperado. Tente novamente.',
        canRetry: true,
      }
  }
}

export function handleAuthError(error: any): string {
  const result = handleApiError(error)

  if (error.statusCode === 401) {
    return 'E-mail ou senha incorretos. Verifique suas credenciais.'
  }

  if (error.statusCode === 404) {
    return 'Usuário não encontrado. Verifique seu e-mail ou cadastre-se.'
  }

  if (error.statusCode === 409) {
    return 'Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.'
  }

  return result.message
}

// Cache para evitar logs duplicados
const errorLogCache = new Map<string, number>()
const ERROR_LOG_THROTTLE_MS = 5000 // 5 segundos

export function logError(error: any, context?: string) {
  if (!import.meta.env.DEV) return

  // Cria uma chave única para o erro
  const errorKey = `${context || 'Unknown'}-${error.statusCode || 0}-${error.message || 'Unknown'}`
  const now = Date.now()
  const lastLogTime = errorLogCache.get(errorKey)

  // Só loga se não foi logado recentemente
  if (!lastLogTime || now - lastLogTime > ERROR_LOG_THROTTLE_MS) {
    errorLogCache.set(errorKey, now)
    
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, {
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
      timestamp: new Date().toISOString(),
    })

    // Limpa cache antigo após 1 minuto
    setTimeout(() => {
      errorLogCache.delete(errorKey)
    }, 60000)
  }
}
