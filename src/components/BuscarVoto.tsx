import { useState } from 'react';
import useBuscarVoto from '../hooks/useBuscarVoto';
import { OpcaoVoto } from '../types/Voto';

const BuscarVoto = () => {
  const [votoId, setVotoId] = useState<string>('');
  const [votoIdError, setVotoIdError] = useState<string | null>(null);
  const { voto, carregando, erro, buscarVotoPorId, limparVoto } = useBuscarVoto();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVotoId(e.target.value);
    setVotoIdError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!votoId.trim()) {
      setVotoIdError('Informe o ID do voto');
      return;
    }
    
    const id = parseInt(votoId);
    if (isNaN(id) || id <= 0) {
      setVotoIdError('ID inválido');
      return;
    }
    
    try {
      await buscarVotoPorId(id);
    } catch (error) {
      console.error('Erro ao buscar voto:', error);
    }
  };

  const handleLimpar = () => {
    setVotoId('');
    setVotoIdError(null);
    limparVoto();
  };

  return (
    <div className="buscar-voto">
      <div className="card">
        <div className="card-titulo">Consultar Voto por ID</div>
        <div className="card-conteudo">
          {!voto && (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="votoId">ID do Voto:</label>
                <input
                  type="number"
                  id="votoId"
                  value={votoId}
                  onChange={handleChange}
                  min="1"
                  disabled={carregando}
                />
                {votoIdError && (
                  <div className="error-text">{votoIdError}</div>
                )}
              </div>
              <button 
                type="submit"
                className="botao-principal"
                disabled={carregando}
              >
                {carregando ? 'Buscando...' : 'Consultar'}
              </button>
            </form>
          )}

          {erro && (
            <div className="error-message">
              {erro}
            </div>
          )}

          {voto && (
            <div className="voto-detalhes">
              <h3>Detalhes do Voto #{voto.id}</h3>
              <p><strong>Associado:</strong> {voto.associadoNome} (ID: {voto.associadoId})</p>
              <p><strong>Pauta:</strong> {voto.pautaTitulo} (ID: {voto.pautaId})</p>
              <p><strong>Voto:</strong> <span className={`voto-opcao ${voto.opcao === OpcaoVoto.SIM ? 'sim' : 'nao'}`}>{voto.opcao}</span></p>
              <p><strong>Data/Hora:</strong> {new Date(voto.dataHora).toLocaleString()}</p>
              
              <button 
                type="button" 
                className="botao-secundario" 
                onClick={handleLimpar}
              >
                Consultar outro voto
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuscarVoto;