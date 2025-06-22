import { Associado } from '../types/Associado';
import { associadoService } from '../service/AssociadoService';
import useListarEntidades from './useListarEntidades';

interface UseListarAssociadosProps {
  paginaInicial?: number;
  tamanhoPagina?: number;
  ordenacao?: string;
  carregarAutomaticamente?: boolean;
}

export default function useListarAssociados(props: UseListarAssociadosProps = {}) {
  const {
    entidades: associados,
    carregando,
    erro,
    pagina,
    tamanho,
    totalPaginas,
    totalElementos,
    ultimaPagina,
    primeiraPagina,
    carregarEntidades: carregarAssociados,
    mudarPagina,
    mudarTamanhoPagina
  } = useListarEntidades<Associado>({
    service: associadoService,
    ...props
  });

  return {
    associados,
    carregando,
    erro,
    pagina,
    tamanho,
    totalPaginas,
    totalElementos,
    ultimaPagina,
    primeiraPagina,
    carregarAssociados,
    mudarPagina,
    mudarTamanhoPagina
  };
}