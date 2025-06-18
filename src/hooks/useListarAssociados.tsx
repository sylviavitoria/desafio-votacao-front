import { useState, useEffect, useCallback } from 'react';
import { Associado } from '../types/Associado';
import { associadoService } from '../service/AssociadoService';

interface UseListarAssociadosProps {
  paginaInicial?: number;
  tamanhoPagina?: number;
  carregarAutomaticamente?: boolean;
}

export default function useListarAssociados({
  paginaInicial = 0,
  tamanhoPagina = 10,
  carregarAutomaticamente = true
}: UseListarAssociadosProps = {}) {
  const [associados, setAssociados] = useState<Associado[]>([]);
  const [pagina, setPagina] = useState(paginaInicial);
  const [tamanho, setTamanho] = useState(tamanhoPagina);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalElementos, setTotalElementos] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ultimaPagina, setUltimaPagina] = useState(false);
  const [primeiraPagina, setPrimeiraPagina] = useState(true);

  const carregarAssociados = useCallback(async (paginaAtual = pagina, tamanhoAtual = tamanho) => {
    setCarregando(true);
    setErro(null);
    
    try {
      const response = await associadoService.listar(paginaAtual, tamanhoAtual);
      setAssociados(response.content);
      setTotalPaginas(response.totalPages);
      setTotalElementos(response.totalElements);
      setUltimaPagina(response.last);
      setPrimeiraPagina(response.first);
    } catch (error) {
      console.error('Erro ao listar associados:', error);
      setErro(error instanceof Error ? error.message : 'Erro ao carregar associados');
    } finally {
      setCarregando(false);
    }
  }, [pagina, tamanho]);

  const mudarPagina = useCallback((novaPagina: number) => {
    if (novaPagina < 0 || (totalPaginas > 0 && novaPagina >= totalPaginas)) {
      return;
    }
    
    setPagina(novaPagina);
    carregarAssociados(novaPagina, tamanho);
  }, [tamanho, totalPaginas, carregarAssociados]);

  const mudarTamanhoPagina = useCallback((novoTamanho: number) => {
    setTamanho(novoTamanho);
    setPagina(0); 
    carregarAssociados(0, novoTamanho);
  }, [carregarAssociados]);

  useEffect(() => {
    if (carregarAutomaticamente) {
      carregarAssociados();
    }
  }, [carregarAutomaticamente, carregarAssociados]);

  return {
    associados,
    pagina,
    tamanho,
    totalPaginas,
    totalElementos,
    carregando,
    erro,
    ultimaPagina,
    primeiraPagina,
    carregarAssociados,
    mudarPagina,
    mudarTamanhoPagina
  };
}