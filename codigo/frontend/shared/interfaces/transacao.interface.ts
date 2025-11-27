// Interface para resposta de saldo
export interface SaldoResponse {
    saldo: number;
}

// Interface para requisição de transferência
export interface TransferenciaRequest {
    alunoId: number;
    valor: number;
    motivo: string;
}

// Interface para transação
export interface Transacao {
    id: number;
    professorId: number;
    professorNome: string;
    alunoId: number;
    alunoNome: string;
    valor: number;
    motivo: string;
    dataHora: string;
}

// Interface para resposta de aluno
export interface AlunoResponse {
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

// Interface para erro de API
export interface ApiError {
    message: string;
    status: number;
}
