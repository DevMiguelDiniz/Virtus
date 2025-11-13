import type {
    VantagemRequest,
    VantagemResponse,
    ResgateVantagemResponse,
    ApiError
} from '../interfaces/vantagem.interface';
import { emailService } from './email.service';

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

    async trocarVantagem(alunoId: number, vantagemId: number): Promise<ResgateVantagemResponse> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/alunos/${alunoId}/resgatar-vantagem`,
                {
                    method: 'POST',
                    headers: this.getAuthHeaders(),
                    body: JSON.stringify({ vantagemId })
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const apiError: ApiError = {
                    message: errorData.message || 'Erro ao resgatar vantagem',
                    status: response.status
                };
                throw apiError;
            }

            const resgate: ResgateVantagemResponse = await response.json();

            // Envia email com QR Code usando EmailJS (não aguarda para não bloquear)
            if (resgate.qrCodeBase64 && resgate.resgateUrl) {
                emailService.enviarEmailResgate({
                    toEmail: resgate.alunoEmail,
                    toName: resgate.alunoNome,
                    vantagemNome: resgate.vantagemNome,
                    codigoResgate: resgate.codigoResgate,
                    valorMoedas: resgate.valorMoedas,
                    dataResgate: new Date(resgate.dataResgate).toLocaleString('pt-BR'),
                    qrCodeBase64: resgate.qrCodeBase64,
                    resgateUrl: resgate.resgateUrl
                }).catch(error => {
                    console.error('Erro ao enviar email (não bloqueante):', error);
                });
            }

            return resgate;
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

    async listarResgates(alunoId: number): Promise<ResgateVantagemResponse[]> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/alunos/${alunoId}/resgates`,
                {
                    method: 'GET',
                    headers: this.getAuthHeaders()
                }
            );

            return await this.handleResponse<ResgateVantagemResponse[]>(response);
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

    async validarResgate(alunoId: number, resgateId: number): Promise<void> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/alunos/${alunoId}/resgates/${resgateId}/validar`,
                {
                    method: 'PUT',
                    headers: this.getAuthHeaders()
                }
            );

            if (response.status === 204) {
                return;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const apiError: ApiError = {
                    message: errorData.message || 'Erro ao validar resgate',
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
