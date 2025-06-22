import { SessaoVotacaoResponse } from '../types/SessaoVotacao';
import { sessaoVotacaoService } from '../service/SessaoVotacaoService';
import useEntidadeDetalhes from './useEntidadeDetalhes';

interface UseSessaoVotacaoDetalhesProps {
  id?: number;
  carregarAutomaticamente?: boolean;
}

export default function useSessaoVotacaoDetalhes(props: UseSessaoVotacaoDetalhesProps = {}) {
  const {
    entidade: sessao,
    carregando,
    erro,
    carregarEntidade: carregarSessao
  } = useEntidadeDetalhes<SessaoVotacaoResponse>({
    service: sessaoVotacaoService,
    ...props
  });

  return {
    sessao,
    carregando,
    erro,
    carregarSessao
  };
}