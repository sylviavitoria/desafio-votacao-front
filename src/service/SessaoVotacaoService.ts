import { AxiosResponse } from 'axios';
import api from './api';
import { montarParametroOrdenacao } from '../utils/ordenacao';
import { 
  SessaoVotacaoRequest, 
  SessaoVotacaoResponse, 
  PageResponse, 
  SessaoVotacaoAtualizarRequest 
} from '../types/SessaoVotacao';

export const sessaoVotacaoService = {
  async criar(sessaoData: SessaoVotacaoRequest): Promise<SessaoVotacaoResponse> {
    const response: AxiosResponse<SessaoVotacaoResponse> = await api.post('/sessoes', sessaoData);
    return response.data;
  },

    async listar(pagina: number = 0, tamanho: number = 10, ordenacao?: string): Promise<PageResponse<SessaoVotacaoResponse>> {
      const sortParam = montarParametroOrdenacao(ordenacao, { campo: 'dataAbertura', direcao: 'desc' });

    const response: AxiosResponse<PageResponse<SessaoVotacaoResponse>> =
      await api.get(`/sessoes?page=${pagina}&size=${tamanho}${sortParam}`);
    return response.data;
  },

  async obterPorId(id: number): Promise<SessaoVotacaoResponse> {
    const response: AxiosResponse<SessaoVotacaoResponse> = await api.get(`/sessoes/${id}`);
    return response.data;
  },
  
  async atualizarPeriodo(id: number, dados: SessaoVotacaoAtualizarRequest): Promise<SessaoVotacaoResponse> {
    const response: AxiosResponse<SessaoVotacaoResponse> = await api.put(`/sessoes/${id}/periodo`, dados);
    return response.data;
  },
  
  async excluir(id: number): Promise<void> {
    await api.delete(`/sessoes/${id}`);
  }
};