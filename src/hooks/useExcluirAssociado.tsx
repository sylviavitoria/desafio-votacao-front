import { associadoService } from '../service/AssociadoService';
import useExcluirEntidade from './useExcluirEntidade';

interface UseExcluirAssociadoProps {
  onSuccess?: () => void;
  onError?: (erro: string) => void;
}

export default function useExcluirAssociado(props: UseExcluirAssociadoProps = {}) {
  const {
    excluir,
    excluindo,
    erro
  } = useExcluirEntidade({
    service: associadoService,
    mensagemConfirmacao: 'Tem certeza que deseja excluir este associado?',
    ...props
  });

  return {
    excluirAssociado: excluir,
    excluindo,
    erro
  };
}