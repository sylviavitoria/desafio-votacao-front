import { AxiosResponse } from 'axios';
import api from './api';
import { Associado, AssociadoResponse, PageResponse } from '../types/Associado';

export const associadoService = {
  async criar(associadoData: Associado): Promise<AssociadoResponse> {
    const response: AxiosResponse<AssociadoResponse> = await api.post('/associados', associadoData);
    return response.data;
  },

  async listar(pagina: number = 0, tamanho: number = 10, ordenacao?: string): Promise<PageResponse<Associado>> {
    let sortParam = '';
    if (ordenacao) {
      const parts = ordenacao.split(',');
      if (parts.length > 1) {
        sortParam = `&sort=${parts[0]}&direction=${parts[1]}`;
      } else {
        sortParam = `&sort=${ordenacao}`;
      }
    } else {
      sortParam = '&sort=nome&direction=asc';
    }

    const response: AxiosResponse<PageResponse<Associado>> =
      await api.get(`/associados?page=${pagina}&size=${tamanho}${sortParam}`);
    return response.data;
  },

  async obterPorId(id: number): Promise<Associado> {
    const response: AxiosResponse<Associado> = await api.get(`/associados/${id}`);
    return response.data;
  },

  async atualizar(id: number, associadoData: Associado): Promise<Associado> {
    const response: AxiosResponse<Associado> = await api.put(`/associados/${id}`, associadoData);
    return response.data;
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/associados/${id}`);
  }
};