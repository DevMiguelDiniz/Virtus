export interface VantagemRequest {
    nome: string;
    descricao: string;
    custoMoedas: number;
    urlFoto?: string;
    empresaId: number;
}

export interface VantagemResponse {
    id: number;
    nome: string;
    descricao: string;
    custoMoedas: number;
    urlFoto?: string;
    empresaId: number;
    dataCadastro?: string;
    ativo?: boolean;
}

export interface ApiError {
    message: string;
    errors?: ValidationError[];
    status: number;
}

export interface ValidationError {
    field: string;
    message: string;
}

export interface ResgateVantagemResponse {
    id: number;
    alunoId: number;
    alunoNome: string;
    vantagemId: number;
    vantagemNome: string;
    vantagemUrlFoto?: string;
    valorMoedas: number;
    dataResgate: string;
    codigoResgate: string;
    utilizado: boolean;
}
