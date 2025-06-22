import { AxiosResponse } from 'axios';
import api from './api';
import { VotoRequest, VotoResponse, ResultadoVotacaoResponse, VotoAtualizarRequest } from '../types/Voto';

export const votoService = {
    async registrarVoto(votoData: VotoRequest): Promise<VotoResponse> {
        const response: AxiosResponse<VotoResponse> = await api.post('/votos', votoData);
        return response.data;
    },

    async obterPorId(id: number): Promise<VotoResponse> {
        const response: AxiosResponse<VotoResponse> = await api.get(`/votos/${id}`);
        return response.data;
    },
    
    async consultarResultado(pautaId: number): Promise<ResultadoVotacaoResponse> {
        const response: AxiosResponse<ResultadoVotacaoResponse> = 
            await api.get(`/votos/pautas/${pautaId}/resultado`);
        return response.data;
    },

    async atualizarVoto(id: number, opcao: OpcaoVoto): Promise<VotoResponse> {
        const request: VotoAtualizarRequest = { opcao };
        const response: AxiosResponse<VotoResponse> = await api.put(`/votos/${id}`, request);
        return response.data;
    }
};