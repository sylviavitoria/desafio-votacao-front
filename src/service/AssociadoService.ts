import { AxiosResponse } from 'axios';
import api from './api';
import { Associado, AssociadoResponse, PageResponse } from '../types/Associado';

export const associadoService = {
  async criar(associadoData: Associado): Promise<AssociadoResponse> {
    const response: AxiosResponse<AssociadoResponse> = await api.post('/associados', associadoData);
    return response.data;
  },

  async listar(pagina: number = 0, tamanho: number = 10): Promise<PageResponse<Associado>> {
    const response: AxiosResponse<PageResponse<Associado>> = 
      await api.get(`/associados?page=${pagina}&size=${tamanho}`);
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