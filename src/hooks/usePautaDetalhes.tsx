import { useState, useEffect } from 'react';
import { PautaResponse } from '../types/Pauta';
import { pautaService } from '../service/PautaService';

interface UsePautaDetalhesProps {
  id?: number;
  carregarAutomaticamente?: boolean;
}

export default function usePautaDetalhes({ 
  id, 
  carregarAutomaticamente = true 
}: UsePautaDetalhesProps = {}) {
  const [pauta, setPauta] = useState<PautaResponse | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregarPauta = async (pautaId?: number) => {
    if (!pautaId) {
      setErro('ID da pauta não informado');
      return;
    }

    setCarregando(true);
    setErro(null);
    
    try {
      const data = await pautaService.obterPorId(pautaId);
      setPauta(data);
    } catch (error) {
      console.error('Erro ao carregar pauta:', error);
      setErro(error instanceof Error ? error.message : 'Erro ao carregar dados da pauta');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (carregarAutomaticamente && id) {
      carregarPauta(id);
    }
  }, [id, carregarAutomaticamente]);

  return {
    pauta,
    carregando,
    erro,
    carregarPauta
  };
}