import { apiRequest } from './api'

export interface ExecuteCodeRequest {
  sourceCode: string
  languageId: number
  input?: string
}

export interface ExecuteCodeResponse {
  sucesso: boolean
  resultado: string
}

const judge0Service = {
  async executeCode(sourceCode: string, languageId: number, input?: string): Promise<ExecuteCodeResponse> {
    return apiRequest<ExecuteCodeResponse>(
      'POST',
      '/execute',
      {
        sourceCode,
        languageId,
        ...(input !== undefined && input !== null ? { input } : {}),
      } as ExecuteCodeRequest
    )
  },
}

export default judge0Service