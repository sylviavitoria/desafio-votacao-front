import { useState, useEffect, useCallback } from 'react';

interface UseEntidadeDetalhesProps<T> {
  service: {
    obterPorId: (id: number) => Promise<T>;
  };
  id?: number;
  carregarAutomaticamente?: boolean;
}

export default function useEntidadeDetalhes<T>({ 
  service,
  id, 
  carregarAutomaticamente = true 
}: UseEntidadeDetalhesProps<T>) {
  const [entidade, setEntidade] = useState<T | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregarEntidade = useCallback(async (entidadeId?: number) => {
    if (!entidadeId) {
      setErro('ID não informado');
      return;
    }

    setCarregando(true);
    setErro(null);
    
    try {
      const data = await service.obterPorId(entidadeId);
      setEntidade(data);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
      setErro(error instanceof Error ? error.message : 'Erro ao carregar dados');
    } finally {
      setCarregando(false);
    }
  }, [service]);

  useEffect(() => {
    if (carregarAutomaticamente && id) {
      carregarEntidade(id);
    }
  }, [id, carregarAutomaticamente, carregarEntidade]);

  return {
    entidade,
    carregando,
    erro,
    carregarEntidade
  };
}