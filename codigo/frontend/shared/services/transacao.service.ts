import type {
    SaldoResponse,
    TransferenciaRequest,
    Transacao,
    AlunoResponse,
    ApiError
} from '../interfaces/transacao.interface';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class TransacaoService {
    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Erro na resposta da API:', {
                status: response.status,
                statusText: response.statusText,
                errorData
            });

            const apiError: ApiError = {
                message: errorData.message || 'Erro ao processar requisição',
                status: response.status
            };

            throw apiError;
        }

        const data = await response.json();
        console.log('Resposta da API (sucesso):', data);
        return data;
    }

    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('@virtus:token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    // Buscar saldo do aluno
    async getSaldoAluno(alunoId: number): Promise<number> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/alunos/${alunoId}/saldo`,
                {
                    method: 'GET',
                    headers: this.getAuthHeaders()
                }
            );

            const data = await this.handleResponse<SaldoResponse>(response);
            return data.saldo;
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

    // Buscar saldo do professor
    async getSaldoProfessor(professorId: number): Promise<number> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/professores/${professorId}/saldo`,
                {
                    method: 'GET',
                    headers: this.getAuthHeaders()
                }
            );

            const data = await this.handleResponse<SaldoResponse>(response);
            return data.saldo;
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

    // Buscar alunos das instituições do professor (NOVO)
    async getAlunosDasInstituicoes(professorId: number): Promise<AlunoResponse[]> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/professores/${professorId}/alunos`,
                {
                    method: 'GET',
                    headers: this.getAuthHeaders()
                }
            );

            return await this.handleResponse<AlunoResponse[]>(response);
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

    // Enviar moedas para um aluno
    async enviarMoedas(
        professorId: number,
        transferencia: TransferenciaRequest
    ): Promise<Transacao> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/professores/${professorId}/enviar-moedas`,
                {
                    method: 'POST',
                    headers: this.getAuthHeaders(),
                    body: JSON.stringify(transferencia)
                }
            );

            return await this.handleResponse<Transacao>(response);
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

    // Buscar extrato do aluno
    async getExtratoAluno(alunoId: number): Promise<Transacao[]> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/alunos/${alunoId}/extrato`,
                {
                    method: 'GET',
                    headers: this.getAuthHeaders()
                }
            );

            return await this.handleResponse<Transacao[]>(response);
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

    // Buscar extrato do professor
    async getExtratoProfessor(professorId: number): Promise<Transacao[]> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/professores/${professorId}/extrato`,
                {
                    method: 'GET',
                    headers: this.getAuthHeaders()
                }
            );

            return await this.handleResponse<Transacao[]>(response);
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

export const transacaoService = new TransacaoService();
