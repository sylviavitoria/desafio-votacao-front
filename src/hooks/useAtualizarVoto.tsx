import { useState } from 'react';
import { votoService } from '../service/VotoService';
import { OpcaoVoto, VotoResponse } from '../types/Voto';

interface UseAtualizarVotoProps {
  onSuccess?: (voto: VotoResponse) => void;
  onError?: (erro: string) => void;
}

export default function useAtualizarVoto({ onSuccess, onError }: UseAtualizarVotoProps = {}) {
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const atualizarVoto = async (id: number, opcao: OpcaoVoto) => {
    setAtualizando(true);
    setErro(null);
    
    try {
      const resultado = await votoService.atualizarVoto(id, opcao);
      
      if (onSuccess) {
        onSuccess(resultado);
      }
      
      return resultado;
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao atualizar o voto';
      setErro(mensagem);
      
      if (onError) {
        onError(mensagem);
      }
      
      throw error;
    } finally {
      setAtualizando(false);
    }
  };

  return {
    atualizarVoto,
    atualizando,
    erro
  };
}