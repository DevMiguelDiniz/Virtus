import type {
    AlunoRequest,
    AlunoResponse,
    ProfessorRequest,
    ProfessorResponse,
    EmpresaRequest,
    EmpresaResponse,
    ApiError
} from '../interfaces/cadastro.interface';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class CadastroService {
    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            const apiError: ApiError = {
                message: errorData.message || 'Erro ao processar requisição',
                errors: errorData.errors || [],
                status: response.status
            };

            throw apiError;
        }

        return response.json();
    }

    async cadastrarAluno(data: AlunoRequest): Promise<AlunoResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/alunos/cadastro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            return this.handleResponse<AlunoResponse>(response);
        } catch (error) {
            if ((error as ApiError).status) {
                throw error;
            }

            throw {
                message: 'Erro de conexão com o servidor',
                status: 0
            } as ApiError;
        }
    }

    async cadastrarProfessor(data: ProfessorRequest): Promise<ProfessorResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/professores/cadastro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            return this.handleResponse<ProfessorResponse>(response);
        } catch (error) {
            if ((error as ApiError).status) {
                throw error;
            }

            throw {
                message: 'Erro de conexão com o servidor',
                status: 0
            } as ApiError;
        }
    }

    async cadastrarEmpresa(data: EmpresaRequest): Promise<EmpresaResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/empresas/cadastro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            return this.handleResponse<EmpresaResponse>(response);
        } catch (error) {
            if ((error as ApiError).status) {
                throw error;
            }

            throw {
                message: 'Erro de conexão com o servidor',
                status: 0
            } as ApiError;
        }
    }
}

export const cadastroService = new CadastroService();