import {ValidationError} from "@/shared/interfaces/cadastro.interface";

export interface AlunoUpdateRequest {
    nome?: string;
    email?: string;
    rg?: string;
    endereco?: string;
    senha?: string;
}

export interface EmpresaUpdateRequest {
    nome?: string;
    endereco?: string;
    email?: string;
    senha?: string;
}

export interface AlunoUpdateResponse {
    id: number;
    login: string;
    nome: string;
    email: string;
    cpf: string;
    rg: string;
    endereco: string;
    saldoMoedas: number;
    ativo: boolean;
}

export interface EmpresaUpdateResponse {
    id: number;
    login: string;
    nome: string;
    cnpj: string;
    endereco: string;
    email: string;
    ativa: boolean;
}

export interface ApiError {
    message: string;
    errors?: ValidationError[];
    status: number;
}
