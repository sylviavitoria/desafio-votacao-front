import { useState } from 'react';
import useVotar from '../hooks/useVotar';
import VotacaoForm from './form/VotacaoForm';
import { OpcaoVoto, VotoResponse } from '../types/Voto';

interface RegistrarVotoProps {
  pautaId: number;
  onVotoRegistrado?: (voto: VotoResponse) => void;
}

const RegistrarVoto = ({ pautaId, onVotoRegistrado }: RegistrarVotoProps) => {
  const [associadoId, setAssociadoId] = useState<number>(0);
  const [associadoIdError, setAssociadoIdError] = useState<string | null>(null);
  const [mostrarFormVoto, setMostrarFormVoto] = useState(false);
  const [votoRegistrado, setVotoRegistrado] = useState(false);
  
  const { votar, votando, erro, resultado } = useVotar({
    onSuccess: (resultado) => {  
      setVotoRegistrado(true);
      if (onVotoRegistrado) {
        onVotoRegistrado(resultado);
      }
    }
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssociadoId(Number(e.target.value));
    setAssociadoIdError(null);
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!associadoId) {
      setAssociadoIdError('Informe o ID do associado para votar');
      return;
    }
    setMostrarFormVoto(true);
  };
  
  const handleVotar = async (opcao: OpcaoVoto) => {
    try {
      await votar(associadoId, pautaId, opcao);
    } catch (error) {
      console.error('Erro ao registrar voto:', error);
    }
  };
  
  if (votoRegistrado && resultado) {
    return (
      <div className="card">
        <div className="card-titulo">Voto registrado com sucesso!</div>
        <div className="card-conteudo">
          <p><strong>Associado:</strong> {resultado.associadoNome}</p>
          <p><strong>Pauta:</strong> {resultado.pautaTitulo}</p>
          <p><strong>Voto:</strong> {resultado.opcao}</p>
          <p><strong>Data/Hora:</strong> {new Date(resultado.dataHora).toLocaleString()}</p>
        </div>
      </div>
    );
  }
  
  if (!mostrarFormVoto) {
    return (
      <div className="card">
        <div className="card-titulo">Votação</div>
        <div className="card-conteudo">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="associadoId">ID do Associado:</label>
              <input
                type="number"
                id="associadoId"
                value={associadoId || ''}
                onChange={handleChange}
                min="1"
              />
              {associadoIdError && (
                <div className="error-text">{associadoIdError}</div>
              )}
            </div>
            <button 
              type="submit"
              className="botao-principal"
            >
              Prosseguir
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  return (
    <VotacaoForm
      associadoId={associadoId}
      pautaId={pautaId}
      votando={votando}
      erro={erro}
      onVotar={handleVotar}
    />
  );
};

export default RegistrarVoto;