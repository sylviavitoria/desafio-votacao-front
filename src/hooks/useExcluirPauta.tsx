import { useState } from 'react';
import { pautaService } from '../service/PautaService';

interface UseExcluirPautaProps {
  onSuccess?: () => void;
  onError?: (erro: string) => void;
}

export default function useExcluirPauta({ 
  onSuccess, 
  onError 
}: UseExcluirPautaProps = {}) {
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const excluirPauta = async (id: number, confirmar: boolean = true) => {
    if (confirmar && !window.confirm('Tem certeza que deseja excluir esta pauta?')) {
      return false;
    }

    setExcluindo(true);
    setErro(null);
    
    try {
      await pautaService.excluir(id);
      
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao excluir pauta';
      setErro(mensagem);
      
      if (onError) {
        onError(mensagem);
      }
      
      return false;
    } finally {
      setExcluindo(false);
    }
  };

  return {
    excluirPauta,
    excluindo,
    erro
  };
}