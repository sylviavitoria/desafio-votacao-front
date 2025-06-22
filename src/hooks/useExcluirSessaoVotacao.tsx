import { sessaoVotacaoService } from '../service/SessaoVotacaoService';
import useExcluirEntidade from './useExcluirEntidade';

interface UseExcluirSessaoVotacaoProps {
  onSuccess?: () => void;
  onError?: (erro: string) => void;
}

export default function useExcluirSessaoVotacao(props: UseExcluirSessaoVotacaoProps = {}) {
  const {
    excluir,
    excluindo,
    erro
  } = useExcluirEntidade({
    service: sessaoVotacaoService,
    mensagemConfirmacao: 'Tem certeza que deseja excluir esta sessão de votação?',
    ...props
  });

  return {
    excluirSessao: excluir,
    excluindo,
    erro
  };
}