import { SessaoVotacaoResponse } from '../types/SessaoVotacao';
import { sessaoVotacaoService } from '../service/SessaoVotacaoService';
import useListarEntidades from './useListarEntidades';

interface UseListarSessoesVotacaoProps {
  paginaInicial?: number;
  tamanhoPagina?: number;
  ordenacao?: string; 
  carregarAutomaticamente?: boolean;
}

export default function useListarSessoesVotacao(props: UseListarSessoesVotacaoProps = {}) {
  const {
    entidades: sessoes,
    carregando,
    erro,
    pagina,
    tamanho,
    totalPaginas,
    totalElementos,
    ultimaPagina,
    primeiraPagina,
    carregarEntidades: carregarSessoes,
    mudarPagina,
    mudarTamanhoPagina
  } = useListarEntidades<SessaoVotacaoResponse>({
    service: sessaoVotacaoService,
    ...props
  });

  return {
    sessoes,
    carregando,
    erro,
    pagina,
    tamanho,
    totalPaginas,
    totalElementos,
    ultimaPagina,
    primeiraPagina,
    carregarSessoes,
    mudarPagina,
    mudarTamanhoPagina
  };
}