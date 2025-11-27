import type { Instituicao } from '../interfaces/instituicao.interface';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class InstituicaoService {
    async listarTodas(): Promise<Instituicao[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/instituicoes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar instituições');
            }

            return response.json();
        } catch (error) {
            console.error('Erro ao buscar instituições:', error);
            throw error;
        }
    }
}

export const instituicaoService = new InstituicaoService();
