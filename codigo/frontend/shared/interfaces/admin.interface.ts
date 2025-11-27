// Interface para resposta de admin
export interface AdminResponse {
    id: number;
    login: string;
    nome: string;
    email: string;
    cpf: string;
    ativo: boolean;
}

// Interface para requisição de cadastro de admin
export interface AdminRequest {
    login: string;
    senha: string;
    nome: string;
    email: string;
    cpf: string;
}

// Interface para gerenciar moedas
export interface GerenciarMoedasRequest {
    usuarioId: number;
    valor: number;
    motivo?: string;
}

// Interface para resposta de gerenciamento de moedas
export interface GerenciarMoedasResponse {
    mensagem: string;
}

// Interface para lista de usuários (simplificada)
export interface UsuarioListItem {
    id: number;
    nome: string;
    email: string;
    saldoMoedas: number;
    tipo: 'ALUNO' | 'PROFESSOR';
}
