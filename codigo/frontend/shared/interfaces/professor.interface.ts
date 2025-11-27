// Interface para resposta de professor
export interface ProfessorResponse {
    id: number;
    login: string;
    nome: string;
    cpf: string;
    departamento: string;
    saldoMoedas: number;
    ativo: boolean;
}
