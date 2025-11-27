import type {
    AlunoUpdateRequest,
    EmpresaUpdateRequest,
    AlunoUpdateResponse,
    EmpresaUpdateResponse,
    ApiError
} from '../interfaces/edicao.interface';
import { loginService } from './login.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class EdicaoService {
    private getAuthHeaders(): HeadersInit {
        const token = loginService.getToken();

        if (!token) {
            throw {
                message: 'Usuário não autenticado',
                status: 401
            } as ApiError;
        }

        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            if (response.status === 401) {
                loginService.logout();
                throw {
                    message: 'Sessão expirada. Faça login novamente.',
                    status: 401
                } as ApiError;
            }

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

    async buscarAluno(alunoId: number): Promise<AlunoUpdateResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/alunos/${alunoId}`, {
                method: 'GET',
                headers: this.getAuthHeaders(),
            });

            return this.handleResponse<AlunoUpdateResponse>(response);
        } catch (error) {
            throw error;
        }
    }

    async buscarEmpresa(empresaId: number): Promise<EmpresaUpdateResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/empresas/${empresaId}`, {
                method: 'GET',
                headers: this.getAuthHeaders(),
            });

            return this.handleResponse<EmpresaUpdateResponse>(response);
        } catch (error) {
            throw error;
        }
    }

    async editarAluno(alunoId: number, data: AlunoUpdateRequest): Promise<AlunoUpdateResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/alunos/${alunoId}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(data),
            });

            return this.handleResponse<AlunoUpdateResponse>(response);
        } catch (error) {
            throw error;
        }
    }


    async editarEmpresa(empresaId: number, data: EmpresaUpdateRequest): Promise<EmpresaUpdateResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/empresas/${empresaId}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(data),
            });

            return this.handleResponse<EmpresaUpdateResponse>(response);
        } catch (error) {
            throw error;
        }
    }

    canEdit(userId: number): boolean {
        const userData = loginService.getUserData();

        if (!userData) {
            return false;
        }

        return userData.id === userId;
    }

    getAuthenticatedUserId(): number | null {
        const userData = loginService.getUserData();
        return userData?.id || null;
    }
}

export const edicaoService = new EdicaoService();