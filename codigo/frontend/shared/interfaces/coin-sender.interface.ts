export interface Student {
    id: number
    nome: string
    email: string
    cpf: string
    curso: string
    instituicao: string
    saldoMoedas: number
}

export interface TransferRequest {
    alunoId: number
    valor: number
    descricao: string
}

export interface TransferResponse {
    id: number
    professorId: number
    alunoId: number
    valor: number
    descricao: string
    data: string
}