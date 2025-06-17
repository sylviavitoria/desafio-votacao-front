import axios from 'axios';
import api from './api';
import { Associado } from '../types/Associado';

interface AssociadoResponseDTO {
  nome: string;
  email: string;
  cpf: string;
}

export const associadoService = {
  async criar(associadoData: Associado): Promise<AssociadoResponseDTO> {
    try {
      const response = await api.post<AssociadoResponseDTO>('/associados', associadoData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return Promise.reject(error.response.data);
      }
      return Promise.reject({ message: 'Erro ao conectar com o servidor' });
    }
  }
};