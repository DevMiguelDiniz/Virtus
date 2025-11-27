const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface ResgateDetalhes {
    id: number;
    codigoResgate: string;
    valorMoedas: number;
    dataResgate: string;
    utilizado: boolean;
    vantagem: {
        id: number;
        nome: string;
        descricao: string;
        custoMoedas: number;
        foto: string;
    };
    aluno: {
        id: number;
        nome: string;
        email: string;
    };
}

export async function buscarResgate(resgateId: number): Promise<ResgateDetalhes> {
    const response = await fetch(`${API_URL}/resgates/${resgateId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Resgate não encontrado');
        }
        throw new Error('Erro ao buscar resgate');
    }

    return response.json();
}

export async function validarResgate(resgateId: number): Promise<ResgateDetalhes> {
    const response = await fetch(`${API_URL}/resgates/${resgateId}/validar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (errorData?.message) {
            throw new Error(errorData.message);
        }
        if (response.status === 404) {
            throw new Error('Resgate não encontrado');
        }
        if (response.status === 400) {
            throw new Error('Este resgate já foi utilizado');
        }
        throw new Error('Erro ao validar resgate');
    }

    return response.json();
}
