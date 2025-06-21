import { VotoResponse } from '../types/Voto';
import { votoService } from '../service/VotoService';
import useEntidadeDetalhes from './useEntidadeDetalhes';

interface UseVotoDetalhesProps {
  id?: number;
  carregarAutomaticamente?: boolean;
}

export default function useVotoDetalhes(props: UseVotoDetalhesProps = {}) {
  const {
    entidade: voto,
    carregando,
    erro,
    carregarEntidade: carregarVoto
  } = useEntidadeDetalhes<VotoResponse>({
    service: votoService,
    ...props
  });

  return {
    voto,
    carregando,
    erro,
    carregarVoto
  };
}