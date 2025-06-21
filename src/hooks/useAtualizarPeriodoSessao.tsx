import { useState } from 'react';
import { SessaoVotacaoAtualizarRequest, SessaoVotacaoResponse } from '../types/SessaoVotacao';
import { sessaoVotacaoService } from '../service/SessaoVotacaoService';

interface UseAtualizarPeriodoSessaoProps {
  onSuccess?: (data: SessaoVotacaoResponse) => void;
  onError?: (erro: string) => void;
}

export default function useAtualizarPeriodoSessao({ onSuccess, onError }: UseAtualizarPeriodoSessaoProps = {}) {
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  const atualizarPeriodo = async (id: number, dados: SessaoVotacaoAtualizarRequest) => {
    setAtualizando(true);
    setErro(null);
    setEnviado(false);
    
    try {
      const response = await sessaoVotacaoService.atualizarPeriodo(id, dados);
      
      setEnviado(true);
      
      if (onSuccess) {
        onSuccess(response);
      }
      
      return response;
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao atualizar período da sessão';
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
    atualizarPeriodo,
    atualizando,
    erro,
    enviado
  };
}