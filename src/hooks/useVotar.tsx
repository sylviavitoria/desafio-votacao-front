import { useState } from 'react';
import { votoService } from '../service/VotoService';
import { VotoRequest, VotoResponse, OpcaoVoto } from '../types/Voto';

interface UseVotarProps {
  onSuccess?: (data: VotoResponse) => void;
  onError?: (erro: string) => void;
}

export default function useVotar({ onSuccess, onError }: UseVotarProps = {}) {
  const [votando, setVotando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<VotoResponse | null>(null);

  const votar = async (associadoId: number, pautaId: number, opcao: OpcaoVoto) => {
    setVotando(true);
    setErro(null);
    setResultado(null);
    
    try {
      const request: VotoRequest = {
        associadoId,
        pautaId,
        opcao
      };
      
      const response = await votoService.registrarVoto(request);
      
      setResultado(response);
      
      if (onSuccess) {
        onSuccess(response);
      }
      
      return response;
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao registrar o voto';
      setErro(mensagem);
      
      if (onError) {
        onError(mensagem);
      }
      
      throw error;
    } finally {
      setVotando(false);
    }
  };

  return {
    votar,
    votando,
    erro,
    resultado
  };
}