import { useState, useEffect, useCallback } from 'react';
import { PautaResponse } from '../types/Pauta';
import { pautaService } from '../service/PautaService';

interface UseListarPautasProps {
  paginaInicial?: number;
  tamanhoPagina?: number;
  ordenacao?: string;
  carregarAutomaticamente?: boolean;
}

export default function useListarPautas({
  paginaInicial = 0,
  tamanhoPagina = 10,
  ordenacao = 'dataCriacao', 
  carregarAutomaticamente = true
}: UseListarPautasProps = {}) {
  const [pautas, setPautas] = useState<PautaResponse[]>([]);
  const [pagina, setPagina] = useState(paginaInicial);
  const [tamanho, setTamanho] = useState(tamanhoPagina);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalElementos, setTotalElementos] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ultimaPagina, setUltimaPagina] = useState(false);
  const [primeiraPagina, setPrimeiraPagina] = useState(true);

  const carregarPautas = useCallback(async (paginaAtual = pagina, tamanhoAtual = tamanho, ordenacaoAtual = ordenacao) => {
    setCarregando(true);
    setErro(null);
    
    try {
      const response = await pautaService.listar(paginaAtual, tamanhoAtual, ordenacaoAtual);
      setPautas(response.content);
      setTotalPaginas(response.totalPages);
      setTotalElementos(response.totalElements);
      setUltimaPagina(response.last);
      setPrimeiraPagina(response.first);
    } catch (error) {
      console.error('Erro ao listar pautas:', error);
      setErro(error instanceof Error ? error.message : 'Erro ao carregar pautas');
    } finally {
      setCarregando(false);
    }
  }, [pagina, tamanho, ordenacao]);

  const mudarPagina = useCallback((novaPagina: number) => {
    if (novaPagina < 0 || (totalPaginas > 0 && novaPagina >= totalPaginas)) {
      return;
    }
    
    setPagina(novaPagina);
    carregarPautas(novaPagina, tamanho);
  }, [tamanho, totalPaginas, carregarPautas]);

  const mudarTamanhoPagina = useCallback((novoTamanho: number) => {
    setTamanho(novoTamanho);
    setPagina(0);
    carregarPautas(0, novoTamanho);
  }, [carregarPautas]);

  useEffect(() => {
    if (carregarAutomaticamente) {
      carregarPautas();
    }
  }, [carregarAutomaticamente, carregarPautas]);

  return {
    pautas,
    pagina,
    tamanho,
    totalPaginas,
    totalElementos,
    carregando,
    erro,
    ultimaPagina,
    primeiraPagina,
    carregarPautas,
    mudarPagina,
    mudarTamanhoPagina
  };
}