import { PautaResponse } from '../types/Pauta';
import { pautaService } from '../service/PautaService';
import useEntidadeDetalhes from './useEntidadeDetalhes';

interface UsePautaDetalhesProps {
  id?: number;
  carregarAutomaticamente?: boolean;
}

export default function usePautaDetalhes(props: UsePautaDetalhesProps = {}) {
  const {
    entidade: pauta,
    carregando,
    erro,
    carregarEntidade: carregarPauta
  } = useEntidadeDetalhes<PautaResponse>({
    service: pautaService,
    ...props
  });

  return {
    pauta,
    carregando,
    erro,
    carregarPauta
  };
}