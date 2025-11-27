// Interfaces para requisições
export interface AlunoRequest {
    login: string;
    senha: string;
    nome: string;
    email: string;
    cpf: string;
    rg: string;
    endereco: string;
}

export interface ProfessorRequest {
    login: string;
    senha: string;
    nome: string;
    cpf: string;
    rg: string;
    departamento: string;
    instituicoes: string[]; // Array de siglas das instituições
}

export interface EmpresaRequest {
    login: string;
    senha: string;
    nome: string;
    cnpj: string;
    endereco: string;
    email: string;
}

// Interfaces para respostas
export interface AlunoResponse {
    id: number;
    login: string;
    nome: string;
    email: string;
    cpf: string;
    rg: string;
    endereco: string;
    instituicao: string; // Sigla da instituição
    saldoMoedas: number;
    dataCadastro: string;
}

export interface ProfessorResponse {
    id: number;
    login: string;
    nome: string;
    cpf: string;
    rg: string;
    departamento: string;
    instituicoes: string[]; // Array de siglas das instituições
    saldoMoedas: number;
    dataCadastro: string;
}

export interface EmpresaResponse {
    id: number;
    login: string;
    nome: string;
    cnpj: string;
    endereco: string;
    email: string;
    dataCadastro: string;
}

// Interface para erros de validação
export interface ValidationError {
    field: string;
    message: string;
}

export interface ApiError {
    message: string;
    errors?: ValidationError[];
    status: number;
}