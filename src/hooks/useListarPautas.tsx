import { PautaResponse } from '../types/Pauta';
import { pautaService } from '../service/PautaService';
import useListarEntidades from './useListarEntidades';

interface UseListarPautasProps {
  paginaInicial?: number;
  tamanhoPagina?: number;
  ordenacao?: string; 
  carregarAutomaticamente?: boolean;
}

export default function useListarPautas(props: UseListarPautasProps = {}) {
  const {
    entidades: pautas,
    carregando,
    erro,
    pagina,
    tamanho,
    totalPaginas,
    totalElementos,
    ultimaPagina,
    primeiraPagina,
    carregarEntidades: carregarPautas,
    mudarPagina,
    mudarTamanhoPagina
  } = useListarEntidades<PautaResponse>({
    service: pautaService,
    ...props
  });

  return {
    pautas,
    carregando,
    erro,
    pagina,
    tamanho,
    totalPaginas,
    totalElementos,
    ultimaPagina,
    primeiraPagina,
    carregarPautas,
    mudarPagina,
    mudarTamanhoPagina
  };
}