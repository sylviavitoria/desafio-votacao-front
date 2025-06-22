import { useState } from 'react';
import { votoService } from '../service/VotoService';
import { ResultadoVotacaoResponse } from '../types/Voto';

const BuscarResultado = () => {
  const [pautaId, setPautaId] = useState<string>('');
  const [pautaIdError, setPautaIdError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ResultadoVotacaoResponse | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPautaId(e.target.value);
    setPautaIdError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!pautaId.trim()) {
      setPautaIdError('Informe o ID da pauta');
      return;
    }
    
    const id = parseInt(pautaId);
    if (isNaN(id) || id <= 0) {
      setPautaIdError('ID inválido');
      return;
    }
    
    setCarregando(true);
    setErro(null);
    
    try {
      const resposta = await votoService.consultarResultado(id);
      setResultado(resposta);
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao buscar resultado';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  const handleLimpar = () => {
    setPautaId('');
    setPautaIdError(null);
    setResultado(null);
    setErro(null);
  };

  return (
    <div className="buscar-resultado">
      <div className="card">
        <div className="card-titulo">Consultar Resultado da Votação</div>
        <div className="card-conteudo">
          {!resultado && (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="pautaId">ID da Pauta:</label>
                <input
                  type="number"
                  id="pautaId"
                  value={pautaId}
                  onChange={handleChange}
                  min="1"
                  disabled={carregando}
                />
                {pautaIdError && (
                  <div className="error-text">{pautaIdError}</div>
                )}
              </div>
              <button 
                type="submit"
                className="botao-principal"
                disabled={carregando}
              >
                {carregando ? 'Consultando...' : 'Consultar Resultado'}
              </button>
            </form>
          )}

          {erro && (
            <div className="error-message">
              {erro}
            </div>
          )}

          {resultado && (
            <div className="resultado-votacao">
              <h3>Resultado da Votação</h3>
              <p><strong>Pauta:</strong> {resultado.pautaTitulo} (ID: {resultado.pautaId})</p>
              
              <div className="votos-container">
                <div className="voto-item">
                  <span className="voto-label">Sim:</span>
                  <span className="voto-count sim">{resultado.votosSim}</span>
                </div>
                <div className="voto-item">
                  <span className="voto-label">Não:</span>
                  <span className="voto-count nao">{resultado.votosNao}</span>
                </div>
                <div className="voto-item">
                  <span className="voto-label">Total:</span>
                  <span className="voto-count">{resultado.totalVotos}</span>
                </div>
              </div>
              
              <button 
                type="button" 
                className="botao-secundario" 
                onClick={handleLimpar}
              >
                Consultar outro resultado
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuscarResultado;