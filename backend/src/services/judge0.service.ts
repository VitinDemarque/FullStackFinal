import axios, { AxiosRequestConfig } from 'axios';

const API_KEY: string = process.env.JUDGE0_API_KEY || '';
const API_HOST: string = 'judge0-ce.p.rapidapi.com';
const API_URL: string = 'https://judge0-ce.p.rapidapi.com/submissions';

interface Judge0Status {
  id: number;
  description: string;
}

interface Judge0Response {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  status: Judge0Status;
  time: string;
  memory: number;
  token: string;
}

export interface ExecuteCodeResult {
  sucesso: boolean;
  resultado: string;
}

export async function executarCodigo(
  sourceCode: string,
  languageId: number
): Promise<ExecuteCodeResult> {
  if (!API_KEY) {
    throw new Error('JUDGE0_API_KEY não configurada nas variáveis de ambiente');
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
  };

  try {
    console.log(`[Judge0] Enviando código (Linguagem: ${languageId})...`);

    const response = await axios.request<Judge0Response>(options);
    const result = response.data;

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

    if (stderr) {
      console.error('[Judge0] Erro de execução:', stderr);
      return { sucesso: false, resultado: stderr };
    } else if (compileOutput) {
      console.error('[Judge0] Erro de compilação:', compileOutput);
      return { sucesso: false, resultado: compileOutput };
    } else {
      console.log('[Judge0] Executado com sucesso.');
      return { sucesso: true, resultado: stdout || '(Executado sem saída)' };
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('[Judge0] Erro na API:', error.response?.data || error.message);
      return { sucesso: false, resultado: 'Erro ao contatar a API de compilação.' };
    } else {
      console.error('[Judge0] Erro inesperado:', error.message);
      return { sucesso: false, resultado: 'Erro interno no servidor.' };
    }
  }
}
