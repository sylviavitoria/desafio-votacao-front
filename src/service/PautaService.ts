import { AxiosResponse } from 'axios';
import api from './api';
import { Pauta, PautaResponse, PageResponse, PautaAtualizarRequest } from '../types/Pauta';
import { montarParametroOrdenacao } from '../utils/ordenacao';

export const pautaService = {
    async criar(pautaData: Pauta): Promise<PautaResponse> {
        const response: AxiosResponse<PautaResponse> = await api.post('/pautas', pautaData);
        return response.data;
    },

    async listar(pagina: number = 0, tamanho: number = 10, ordenacao?: string): Promise<PageResponse<PautaResponse>> {
        const sortParam = montarParametroOrdenacao(ordenacao, { campo: 'dataCriacao', direcao: 'desc' });

        const response: AxiosResponse<PageResponse<PautaResponse>> =
            await api.get(`/pautas?page=${pagina}&size=${tamanho}${sortParam}`);
        return response.data;
    },

    async obterPorId(id: number): Promise<PautaResponse> {
        const response: AxiosResponse<PautaResponse> = await api.get(`/pautas/${id}`);
        return response.data;
    },

    async atualizar(id: number, pautaData: PautaAtualizarRequest): Promise<PautaResponse> {
        const response: AxiosResponse<PautaResponse> = await api.put(`/pautas/${id}`, pautaData);
        return response.data;
    },

    async excluir(id: number): Promise<void> {
        await api.delete(`/pautas/${id}`);
    }
};