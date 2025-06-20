import { useState, useEffect, useCallback } from 'react';
import { PageResponse } from '../types/Pauta';

interface UseListarEntidadesProps<T> {
  service: {
    listar: (pagina: number, tamanho: number, ordenacao?: string) => Promise<PageResponse<T>>;
  };
  paginaInicial?: number;
  tamanhoPagina?: number;
  ordenacao?: string;
  carregarAutomaticamente?: boolean;
}

export default function useListarEntidades<T>({
  service,
  paginaInicial = 0,
  tamanhoPagina = 10,
  ordenacao,
  carregarAutomaticamente = true
}: UseListarEntidadesProps<T>) {
  const [entidades, setEntidades] = useState<T[]>([]);
  const [pagina, setPagina] = useState(paginaInicial);
  const [tamanho, setTamanho] = useState(tamanhoPagina);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalElementos, setTotalElementos] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ultimaPagina, setUltimaPagina] = useState(false);
  const [primeiraPagina, setPrimeiraPagina] = useState(true);

  const carregarEntidades = useCallback(async (paginaAtual = pagina, tamanhoAtual = tamanho, ordenacaoAtual = ordenacao) => {
    setCarregando(true);
    setErro(null);
    
    try {
      const response = await service.listar(paginaAtual, tamanhoAtual, ordenacaoAtual);
      setEntidades(response.content);
      setTotalPaginas(response.totalPages);
      setTotalElementos(response.totalElements);
      setUltimaPagina(response.last);
      setPrimeiraPagina(response.first);
    } catch (error) {
      console.error('Erro ao listar entidades:', error);
      setErro(error instanceof Error ? error.message : 'Erro ao carregar dados');
    } finally {
      setCarregando(false);
    }
  }, [pagina, tamanho, ordenacao, service]);

  const mudarPagina = useCallback((novaPagina: number) => {
    if (novaPagina < 0 || (totalPaginas > 0 && novaPagina >= totalPaginas)) {
      return;
    }
    
    setPagina(novaPagina);
    carregarEntidades(novaPagina, tamanho, ordenacao);
  }, [tamanho, totalPaginas, ordenacao, carregarEntidades]);

  const mudarTamanhoPagina = useCallback((novoTamanho: number) => {
    setTamanho(novoTamanho);
    setPagina(0);
    carregarEntidades(0, novoTamanho, ordenacao);
  }, [ordenacao, carregarEntidades]);

  useEffect(() => {
    if (carregarAutomaticamente) {
      carregarEntidades();
    }
  }, [carregarAutomaticamente, carregarEntidades]);

  return {
    entidades,
    pagina,
    tamanho,
    totalPaginas,
    totalElementos,
    carregando,
    erro,
    ultimaPagina,
    primeiraPagina,
    carregarEntidades,
    mudarPagina,
    mudarTamanhoPagina
  };
}