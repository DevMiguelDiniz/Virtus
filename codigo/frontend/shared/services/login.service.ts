import type {
    LoginRequest,
    AuthResponse,
    UserData,
    AuthError
} from '../interfaces/login.interface';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class LoginService {
    private readonly TOKEN_KEY = '@virtus:token';
    private readonly USER_KEY = '@virtus:user';

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            const authError: AuthError = {
                message: errorData.message || 'Credenciais inválidas',
                status: response.status
            };

            throw authError;
        }

        return response.json();
    }

    async login(email: string, senha: string): Promise<AuthResponse> {
        try {
            const loginData: LoginRequest = {
                login: email,
                senha
            };

            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const authResponse = await this.handleResponse<AuthResponse>(response);

            // Armazenar token e dados do usuário
            this.saveAuthData(authResponse);

            return authResponse;
        } catch (error) {
            if ((error as AuthError).status) {
                throw error;
            }

            throw {
                message: 'Erro de conexão com o servidor',
                status: 0
            } as AuthError;
        }
    }

    private saveAuthData(authResponse: AuthResponse): void {
        // Salvar token
        localStorage.setItem(this.TOKEN_KEY, authResponse.token);

        // Mapear o tipoUsuario para tipo
        const tipo = authResponse.tipoUsuario as 'ALUNO' | 'EMPRESA' | 'PROFESSOR' | 'ADMIN';

        // Salvar dados do usuário
        const userData: UserData = {
            token: authResponse.token,
            tipo: tipo,
            id: authResponse.id,
            nome: authResponse.nome,
            ...(authResponse.email && { email: authResponse.email }),
            ...(authResponse.cpf && { cpf: authResponse.cpf }),
            ...(authResponse.rg && { rg: authResponse.rg }),
            ...(authResponse.endereco && { endereco: authResponse.endereco }),
            ...(authResponse.saldoMoedas !== undefined && { saldoMoedas: authResponse.saldoMoedas }),
            ...(authResponse.cnpj && { cnpj: authResponse.cnpj }),
        };

        localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
    }

    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.TOKEN_KEY);
    }

    getUserData(): UserData | null {
        if (typeof window === 'undefined') return null;

        const userData = localStorage.getItem(this.USER_KEY);
        if (!userData) return null;

        try {
            return JSON.parse(userData);
        } catch {
            return null;
        }
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }

    getUserType(): 'ALUNO' | 'EMPRESA' | 'PROFESSOR' | 'ADMIN' | null {
        const userData = this.getUserData();
        return userData?.tipo || null;
    }
}

export const loginService = new LoginService();