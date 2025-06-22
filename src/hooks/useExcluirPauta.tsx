import { pautaService } from '../service/PautaService';
import useExcluirEntidade from './useExcluirEntidade';

interface UseExcluirPautaProps {
  onSuccess?: () => void;
  onError?: (erro: string) => void;
}

export default function useExcluirPauta(props: UseExcluirPautaProps = {}) {
  const {
    excluir,
    excluindo,
    erro
  } = useExcluirEntidade({
    service: pautaService,
    mensagemConfirmacao: 'Tem certeza que deseja excluir esta pauta?',
    ...props
  });

  return {
    excluirPauta: excluir,
    excluindo,
    erro
  };
}