import type {
    GerenciarMoedasRequest,
    GerenciarMoedasResponse,
    AdminResponse,
    UsuarioListItem
} from '../interfaces/admin.interface';
import type { AlunoResponse } from '../interfaces/transacao.interface';
import type { ProfessorResponse } from '../interfaces/professor.interface';
import type { ApiError } from '../interfaces/transacao.interface';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class AdminService {
    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            const apiError: ApiError = {
                message: errorData.message || 'Erro ao processar requisição',
                status: response.status
            };

            throw apiError;
        }

        return response.json();
    }

    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('@virtus:token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    // Buscar admin por ID
    async buscarPorId(adminId: number): Promise<AdminResponse> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/admins/${adminId}`,
                {
                    method: 'GET',
                    headers: this.getAuthHeaders()
                }
            );

            return await this.handleResponse<AdminResponse>(response);
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

    // Adicionar moedas a aluno
    async adicionarMoedasAluno(request: GerenciarMoedasRequest): Promise<string> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/admins/alunos/adicionar-moedas`,
                {
                    method: 'POST',
                    headers: this.getAuthHeaders(),
                    body: JSON.stringify(request)
                }
            );

            const data = await this.handleResponse<GerenciarMoedasResponse>(response);
            return data.mensagem;
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

    // Remover moedas de aluno
    async removerMoedasAluno(request: GerenciarMoedasRequest): Promise<string> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/admins/alunos/remover-moedas`,
                {
                    method: 'POST',
                    headers: this.getAuthHeaders(),
                    body: JSON.stringify(request)
                }
            );

            const data = await this.handleResponse<GerenciarMoedasResponse>(response);
            return data.mensagem;
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

    // Adicionar moedas a professor
    async adicionarMoedasProfessor(request: GerenciarMoedasRequest): Promise<string> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/admins/professores/adicionar-moedas`,
                {
                    method: 'POST',
                    headers: this.getAuthHeaders(),
                    body: JSON.stringify(request)
                }
            );

            const data = await this.handleResponse<GerenciarMoedasResponse>(response);
            return data.mensagem;
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

    // Remover moedas de professor
    async removerMoedasProfessor(request: GerenciarMoedasRequest): Promise<string> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/admins/professores/remover-moedas`,
                {
                    method: 'POST',
                    headers: this.getAuthHeaders(),
                    body: JSON.stringify(request)
                }
            );

            const data = await this.handleResponse<GerenciarMoedasResponse>(response);
            return data.mensagem;
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

    // Buscar todos os alunos (reutiliza do transacaoService, mas retorna como UsuarioListItem)
    async listarAlunos(): Promise<UsuarioListItem[]> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/alunos`,
                {
                    method: 'GET',
                    headers: this.getAuthHeaders()
                }
            );

            const alunos = await this.handleResponse<AlunoResponse[]>(response);

            return alunos.map(aluno => ({
                id: aluno.id,
                nome: aluno.nome,
                email: aluno.email,
                saldoMoedas: aluno.saldoMoedas,
                tipo: 'ALUNO' as const
            }));
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

    // Buscar todos os professores
    async listarProfessores(): Promise<UsuarioListItem[]> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/professores`,
                {
                    method: 'GET',
                    headers: this.getAuthHeaders()
                }
            );

            const professores = await this.handleResponse<any[]>(response);

            return professores.map(professor => ({
                id: professor.id,
                nome: professor.nome,
                email: professor.email || '',
                saldoMoedas: professor.saldoMoedas || 0,
                tipo: 'PROFESSOR' as const
            }));
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

export const adminService = new AdminService();
