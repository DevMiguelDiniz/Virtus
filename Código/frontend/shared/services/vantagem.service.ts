import type {
    VantagemRequest,
    VantagemResponse,
    ApiError
} from '../interfaces/vantagem.interface';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class VantagemService {
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

    async cadastrarVantagem(empresaId: number, vantagem: Omit<VantagemRequest, 'empresaId'>): Promise<VantagemResponse> {
        try {
            const vantagemData: VantagemRequest = {
                ...vantagem,
                empresaId
            };

            const response = await fetch(
                `${API_BASE_URL}/api/empresas/${empresaId}/vantagens`,
                {
                    method: 'POST',
                    headers: this.getAuthHeaders(),
                    body: JSON.stringify(vantagemData)
                }
            );

            return await this.handleResponse<VantagemResponse>(response);
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

    async listarVantagensPorEmpresa(empresaId: number): Promise<VantagemResponse[]> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/vantagens/empresa/${empresaId}`,
                {
                    method: 'GET',
                    headers: this.getAuthHeaders()
                }
            );

            return await this.handleResponse<VantagemResponse[]>(response);
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

    async listarTodas(): Promise<VantagemResponse[]> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/vantagens`,
                {
                    method: 'GET',
                    headers: this.getAuthHeaders()
                }
            );

            return await this.handleResponse<VantagemResponse[]>(response);
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

    async excluirVantagem(empresaId: number, vantagemId: number): Promise<void> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/empresas/${empresaId}/vantagens/${vantagemId}`,
                {
                    method: 'DELETE',
                    headers: this.getAuthHeaders()
                }
            );

            // 204 No Content é sucesso - não tem corpo na resposta
            if (response.status === 204) {
                return;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const apiError: ApiError = {
                    message: errorData.message || 'Erro ao excluir vantagem',
                    status: response.status
                };
                throw apiError;
            }
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

export const vantagemService = new VantagemService();
