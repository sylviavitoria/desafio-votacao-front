import { useState } from 'react';

interface UseExcluirEntidadeProps {
  service: {
    excluir: (id: number) => Promise<void>;
  };
  mensagemConfirmacao?: string;
  onSuccess?: () => void;
  onError?: (erro: string) => void;
}

export default function useExcluirEntidade({ 
  service,
  mensagemConfirmacao = 'Tem certeza que deseja excluir este item?',
  onSuccess, 
  onError 
}: UseExcluirEntidadeProps) {
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const excluir = async (id: number, confirmar: boolean = true) => {
    if (confirmar && !window.confirm(mensagemConfirmacao)) {
      return false;
    }

    setExcluindo(true);
    setErro(null);
    
    try {
      await service.excluir(id);
      
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao excluir item';
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
    excluir,
    excluindo,
    erro
  };
}