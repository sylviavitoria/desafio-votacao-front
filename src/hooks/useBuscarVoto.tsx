import { useState } from 'react';
import { VotoResponse } from '../types/Voto';
import { votoService } from '../service/VotoService';

export default function useBuscarVoto() {
  const [voto, setVoto] = useState<VotoResponse | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const buscarVotoPorId = async (id: number) => {
    setCarregando(true);
    setErro(null);
    
    try {
      const resultado = await votoService.obterPorId(id);
      setVoto(resultado);
      return resultado;
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao buscar voto';
      setErro(mensagem);
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  const limparVoto = () => {
    setVoto(null);
    setErro(null);
  };

  return { 
    voto, 
    carregando, 
    erro, 
    buscarVotoPorId,
    limparVoto
  };
}