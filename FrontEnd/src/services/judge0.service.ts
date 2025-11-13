import { apiRequest } from './api'

export interface ExecuteCodeRequest {
  sourceCode: string
  languageId: number
}

export interface ExecuteCodeResponse {
  sucesso: boolean
  resultado: string
}

const judge0Service = {
  async executeCode(sourceCode: string, languageId: number): Promise<ExecuteCodeResponse> {
    return apiRequest<ExecuteCodeResponse>(
      'POST',
      '/execute',
      {
        sourceCode,
        languageId,
      } as ExecuteCodeRequest
    )
  },
}

export default judge0Service