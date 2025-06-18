import { useState, useEffect } from 'react';
import { Associado } from '../types/Associado';
import { associadoService } from '../service/AssociadoService';

interface UseAssociadoDetalhesProps {
  id?: number;
  carregarAutomaticamente?: boolean;
}

export default function useAssociadoDetalhes({ 
  id, 
  carregarAutomaticamente = true 
}: UseAssociadoDetalhesProps = {}) {
  const [associado, setAssociado] = useState<Associado | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregarAssociado = async (associadoId?: number) => {
    if (!associadoId) {
      setErro('ID do associado não informado');
      return;
    }

    setCarregando(true);
    setErro(null);
    
    try {
      const data = await associadoService.obterPorId(associadoId);
      setAssociado(data);
    } catch (error) {
      console.error('Erro ao carregar associado:', error);
      setErro(error instanceof Error ? error.message : 'Erro ao carregar dados do associado');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (carregarAutomaticamente && id) {
      carregarAssociado(id);
    }
  }, [id, carregarAutomaticamente]);

  return {
    associado,
    carregando,
    erro,
    carregarAssociado
  };
}