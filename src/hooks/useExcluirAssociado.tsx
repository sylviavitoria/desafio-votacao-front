import { useState } from 'react';
import { associadoService } from '../service/AssociadoService';

interface UseExcluirAssociadoProps {
  onSuccess?: () => void;
  onError?: (erro: string) => void;
}

export default function useExcluirAssociado({ 
  onSuccess, 
  onError 
}: UseExcluirAssociadoProps = {}) {
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const excluirAssociado = async (id: number, confirmar: boolean = true) => {
    if (confirmar && !window.confirm('Tem certeza que deseja excluir este associado?')) {
      return false;
    }

    setExcluindo(true);
    setErro(null);
    
    try {
      await associadoService.excluir(id);
      
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao excluir associado';
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
    excluirAssociado,
    excluindo,
    erro
  };
}