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

    // Buscar lista de todos os alunos (para professores) - DEPRECATED
    async getAlunos(): Promise<AlunoResponse[]> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/alunos`,
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

    async aplicarCodigoTransacao(professorId: number, codigo: string): Promise<any> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/professores/${professorId}/aplicar-codigo`,
                {
                    method: 'POST',
                    headers: this.getAuthHeaders(),
                    body: JSON.stringify({ codigo })
                }
            )

            return await this.handleResponse<any>(response)
        } catch (error) {
            if ((error as ApiError).status) {
                throw error
            }

            throw {
                message: 'Erro de conexão com o servidor',
                status: 0
            } as ApiError
        }
    }

    // Criar link de pagamento (para alunos criarem um link que outros podem pagar)
    async criarLinkPagamento(alunoId: number, body: { valorLinkPagamento: number }): Promise<{ linkPagamento: string; valor: number }> {
        try {
            // Gerar um código único para o link de pagamento
            const codigoUnico = `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
            const linkPagamento = `${window.location.origin}/pagar/${codigoUnico}`;
            
            const response = await fetch(
                `${API_BASE_URL}/api/alunos/${alunoId}/link-pagamento`,
                {
                    method: 'POST',
                    headers: this.getAuthHeaders(),
                    body: JSON.stringify({
                        linkPagamento: linkPagamento,
                        valor: body.valorLinkPagamento
                    })
                }
            )

            return await this.handleResponse<{ linkPagamento: string; valor: number }>(response)
        } catch (error) {
            if ((error as ApiError).status) {
                throw error
            }

            throw {
                message: 'Erro de conexão com o servidor',
                status: 0
            } as ApiError
        }
    }

    // Pagar um link de pagamento (qualquer usuário que pagar o link)
    async pagarLinkPagamento(pagadorId: number, link: string): Promise<any> {
        try {
            console.log('Tentando pagar link:', { pagadorId, link });
            
            const response = await fetch(
                `${API_BASE_URL}/api/alunos/pagar-link`,
                {
                    method: 'POST',
                    headers: this.getAuthHeaders(),
                    body: JSON.stringify({ pagadorId, link })
                }
            )

            console.log('Response status:', response.status);
            const result = await this.handleResponse<any>(response);
            console.log('Pagamento processado com sucesso:', result);
            return result;
        } catch (error) {
            console.error('Erro completo ao pagar link:', error);
            if ((error as ApiError).status) {
                throw error
            }

            throw {
                message: 'Erro de conexão com o servidor',
                status: 0
            } as ApiError
        }
    }
}

export const transacaoService = new TransacaoService();
