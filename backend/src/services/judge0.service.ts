import axios, { AxiosRequestConfig } from 'axios';

const API_KEY: string = process.env.JUDGE0_API_KEY || '';
const API_HOST: string = 'judge0-ce.p.rapidapi.com';
const API_URL: string = 'https://judge0-ce.p.rapidapi.com/submissions';

export interface ExecuteCodeResult {
  sucesso: boolean;
  resultado: string;
  error?: string;  // Mensagem de erro detalhada (se houver)
}

export interface ExecuteCodeWithInputResult {
  sucesso: boolean;
  resultado: string;      // Saída do código (stdout)
  error?: string;        // Erro de compilação ou runtime (stderr)
  compileError?: string; // Erro específico de compilação
  statusId?: number;     // ID do status do Judge0
}

export async function executarCodigo(
  sourceCode: string,
  languageId: number
): Promise<ExecuteCodeResult> {
  if (!API_KEY) {
    return { 
      sucesso: false, 
      resultado: 'API de compilação não configurada. Por favor, configure a JUDGE0_API_KEY nas variáveis de ambiente.' 
    };
  }

  const encodedSourceCode = Buffer.from(sourceCode).toString('base64');

  const options: AxiosRequestConfig = {
    method: 'POST',
    url: API_URL,
    params: {
      base64_encoded: 'true',
      wait: 'true',
    },
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': API_HOST,
    },
    data: {
      language_id: languageId,
      source_code: encodedSourceCode,
    },
    timeout: 30000,
  };

  try {
    const response = await axios.request<any>(options);
    let result = response.data;

    if (result.token && (!result.status || result.status.id === 1 || result.status.id === 2)) {
      const token = result.token;
      const maxAttempts = 20;
      const delayMs = 1000;
      
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
        
        try {
          const statusResponse = await axios.request({
            method: 'GET',
            url: `${API_URL}/${token}`,
            params: {
              base64_encoded: 'true',
            },
            headers: {
              'X-RapidAPI-Key': API_KEY,
              'X-RapidAPI-Host': API_HOST,
            },
          });
          
          result = statusResponse.data;
          
          if (result.status && (result.status.id === 1 || result.status.id === 2)) {
            continue;
          }
          
          break;
        } catch (pollError: any) {
          if (attempt === maxAttempts - 1) {
            return { sucesso: false, resultado: 'Timeout ao obter resultado da execução após várias tentativas' };
          }
        }
      }
    }

    if (!result || (!result.status && !result.stdout && !result.stderr && !result.compile_output)) {
      return { sucesso: false, resultado: 'Resposta inválida da API de compilação' };
    }

    const decodeBase64 = (str: string | null): string => {
      if (!str) return '';
      try {
        return Buffer.from(str, 'base64').toString('utf-8');
      } catch {
        return str;
      }
    };

    const stdout = decodeBase64(result.stdout);
    const stderr = decodeBase64(result.stderr);
    const compileOutput = decodeBase64(result.compile_output);

    if (result.status) {
      const statusId = result.status.id;
      
      if (statusId === 3) {
        if (stderr) {
          return { sucesso: false, resultado: stderr };
        } else if (compileOutput) {
          return { sucesso: false, resultado: compileOutput };
        } else {
          return { sucesso: true, resultado: stdout || '(Executado sem saída)' };
        }
      }
      
      if (compileOutput) {
        return { sucesso: false, resultado: compileOutput };
      } else if (stderr) {
        return { sucesso: false, resultado: stderr };
      } else {
        const statusMessages: Record<number, string> = {
          1: 'Em fila',
          2: 'Processando',
          4: 'Resposta incorreta',
          5: 'Timeout na execução',
          6: 'Erro de compilação',
          7: 'Erro interno do Judge0',
          8: 'Erro de memória',
          9: 'Erro de limite de saída',
          10: 'Erro de runtime',
          11: 'Erro de runtime (NZEC)',
          12: 'Erro de runtime (Other)',
        };
        const statusMsg = statusMessages[statusId] || result.status.description || `Erro (Status: ${statusId})`;
        return { sucesso: false, resultado: statusMsg };
      }
    }

    if (stderr) {
      return { sucesso: false, resultado: stderr };
    } else if (compileOutput) {
      return { sucesso: false, resultado: compileOutput };
    } else {
      return { sucesso: true, resultado: stdout || '(Executado sem saída)' };
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro desconhecido';
      return { 
        sucesso: false, 
        resultado: `Erro ao contatar a API de compilação: ${errorMessage}${error.response?.status ? ` (Status: ${error.response.status})` : ''}` 
      };
    } else {
      const errorMsg = error instanceof Error ? error.message : 'Erro interno no servidor.';
      return { sucesso: false, resultado: errorMsg };
    }
  }
}

/**
 * Executa código com entrada customizada (stdin)
 * 
 * Esta função é usada para executar testes, onde precisamos passar
 * uma entrada específica para o código do usuário.
 * 
 * @param sourceCode - Código fonte a ser executado
 * @param languageId - ID da linguagem (ex: 62 para Java)
 * @param input - Entrada que será passada para o código via stdin (pode ser vazio)
 * @returns Resultado da execução com stdout, stderr e status
 */
export async function executarCodigoComInput(
  sourceCode: string,
  languageId: number,
  input: string = ''
): Promise<ExecuteCodeWithInputResult> {
  if (!API_KEY) {
    return { 
      sucesso: false, 
      resultado: '',
      error: 'API de compilação não configurada. Por favor, configure a JUDGE0_API_KEY nas variáveis de ambiente.'
    };
  }

  const encodedSourceCode = Buffer.from(sourceCode).toString('base64');
  const encodedInput = Buffer.from(input).toString('base64');

  const options: AxiosRequestConfig = {
    method: 'POST',
    url: API_URL,
    params: {
      base64_encoded: 'true',
      wait: 'true',
    },
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': API_HOST,
    },
    data: {
      language_id: languageId,
      source_code: encodedSourceCode,
      stdin: encodedInput,  // Entrada customizada
    },
    timeout: 30000,
  };

  try {
    const response = await axios.request<any>(options);
    let result = response.data;

    // Se retornou token, precisa fazer polling
    if (result.token && (!result.status || result.status.id === 1 || result.status.id === 2)) {
      const token = result.token;
      const maxAttempts = 20;
      const delayMs = 1000;
      
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
        
        try {
          const statusResponse = await axios.request({
            method: 'GET',
            url: `${API_URL}/${token}`,
            params: {
              base64_encoded: 'true',
            },
            headers: {
              'X-RapidAPI-Key': API_KEY,
              'X-RapidAPI-Host': API_HOST,
            },
          });
          
          result = statusResponse.data;
          
          if (result.status && (result.status.id === 1 || result.status.id === 2)) {
            continue; // Ainda processando
          }
          
          break; // Processamento concluído
        } catch (pollError: any) {
          if (attempt === maxAttempts - 1) {
            return { 
              sucesso: false, 
              resultado: '',
              error: 'Timeout ao obter resultado da execução após várias tentativas'
            };
          }
        }
      }
    }

    if (!result || (!result.status && !result.stdout && !result.stderr && !result.compile_output)) {
      return { 
        sucesso: false, 
        resultado: '',
        error: 'Resposta inválida da API de compilação'
      };
    }

    const decodeBase64 = (str: string | null): string => {
      if (!str) return '';
      try {
        return Buffer.from(str, 'base64').toString('utf-8');
      } catch {
        return str;
      }
    };

    const stdout = decodeBase64(result.stdout);
    const stderr = decodeBase64(result.stderr);
    const compileOutput = decodeBase64(result.compile_output);
    const statusId = result.status?.id;

    // Status 3 = Accepted (sucesso)
    if (statusId === 3) {
      // Se tem stderr, pode ser um aviso, mas ainda é sucesso
      if (compileOutput) {
        return {
          sucesso: false,
          resultado: '',
          compileError: compileOutput,
          statusId
        };
      }
      
      return {
        sucesso: true,
        resultado: stdout || '',
        error: stderr || undefined,
        statusId
      };
    }

    // Outros status = erro
    if (compileOutput) {
      return {
        sucesso: false,
        resultado: '',
        compileError: compileOutput,
        error: 'Erro de compilação',
        statusId
      };
    }

    if (stderr) {
      return {
        sucesso: false,
        resultado: '',
        error: stderr,
        statusId
      };
    }

    // Status de erro conhecidos
    const statusMessages: Record<number, string> = {
      1: 'Em fila',
      2: 'Processando',
      4: 'Resposta incorreta',
      5: 'Timeout na execução',
      6: 'Erro de compilação',
      7: 'Erro interno do Judge0',
      8: 'Erro de memória',
      9: 'Erro de limite de saída',
      10: 'Erro de runtime',
      11: 'Erro de runtime (NZEC)',
      12: 'Erro de runtime (Other)',
    };

    const statusMsg = statusMessages[statusId || 0] || result.status?.description || `Erro (Status: ${statusId})`;
    
    return {
      sucesso: false,
      resultado: '',
      error: statusMsg,
      statusId
    };

  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro desconhecido';
      return { 
        sucesso: false, 
        resultado: '',
        error: `Erro ao contatar a API de compilação: ${errorMessage}${error.response?.status ? ` (Status: ${error.response.status})` : ''}`
      };
    } else {
      const errorMsg = error instanceof Error ? error.message : 'Erro interno no servidor.';
      return { 
        sucesso: false, 
        resultado: '',
        error: errorMsg
      };
    }
  }
}
