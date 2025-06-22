import { Associado } from '../types/Associado';
import { associadoService } from '../service/AssociadoService';
import useEntidadeDetalhes from './useEntidadeDetalhes';

interface UseAssociadoDetalhesProps {
  id?: number;
  carregarAutomaticamente?: boolean;
}

export default function useAssociadoDetalhes(props: UseAssociadoDetalhesProps = {}) {
  const {
    entidade: associado,
    carregando,
    erro,
    carregarEntidade: carregarAssociado
  } = useEntidadeDetalhes<Associado>({
    service: associadoService,
    ...props
  });

  return {
    associado,
    carregando,
    erro,
    carregarAssociado
  };
}