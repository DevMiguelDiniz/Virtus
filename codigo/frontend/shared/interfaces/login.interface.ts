// Interface para requisição de login
export interface LoginRequest {
    login: string;
    senha: string;
}

// Interface para resposta de autenticação
export interface AuthResponse {
    token: string;
    tipo?: string; // "Bearer"
    id: number;
    login: string;
    tipoUsuario: string; // 'ALUNO' | 'EMPRESA' | 'PROFESSOR' | 'ADMIN'
    nome: string;
    // Campos adicionais podem vir do backend
    email?: string;
    cpf?: string;
    rg?: string;
    endereco?: string;
    saldoMoedas?: number;
    cnpj?: string;
    dataCadastro?: string;
}

// Interface para dados do usuário armazenados
export interface UserData {
    token: string;
    tipo: 'ALUNO' | 'EMPRESA' | 'PROFESSOR' | 'ADMIN';
    id: number;
    nome: string;
    email?: string;
    cpf?: string;
    rg?: string;
    endereco?: string;
    saldoMoedas?: number;
    cnpj?: string;
}

// Interface para erro de autenticação
export interface AuthError {
    message: string;
    status: number;
}