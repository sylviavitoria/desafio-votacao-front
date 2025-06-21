import { AxiosResponse } from 'axios';
import api from './api';
import { VotoRequest, VotoResponse } from '../types/Voto';

export const votoService = {
    async registrarVoto(votoData: VotoRequest): Promise<VotoResponse> {
        const response: AxiosResponse<VotoResponse> = await api.post('/votos', votoData);
        return response.data;
    },

    async obterPorId(id: number): Promise<VotoResponse> {
        const response: AxiosResponse<VotoResponse> = await api.get(`/votos/${id}`);
        return response.data;
    }
};