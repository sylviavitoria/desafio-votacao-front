import { useState } from 'react';
import useBuscarVoto from '../hooks/useBuscarVoto';
import useAtualizarVoto from '../hooks/useAtualizarVoto';
import { OpcaoVoto } from '../types/Voto';

const BuscarVoto = () => {
  const [votoId, setVotoId] = useState<string>('');
  const [votoIdError, setVotoIdError] = useState<string | null>(null);
  const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
  const { voto, carregando, erro, buscarVotoPorId, limparVoto } = useBuscarVoto();

  const { 
    atualizarVoto, 
    atualizando, 
    erro: erroAtualizacao 
  } = useAtualizarVoto({
    onSuccess: (novoVoto) => {
      limparVoto();
      buscarVotoPorId(novoVoto.id);
      setMostrarOpcoes(false);
    }
  });

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
    setMostrarOpcoes(false);
  };

  const handleTrocarVoto = () => {
    setMostrarOpcoes(true);
  };

  const handleAtualizarVoto = async (opcao: OpcaoVoto) => {
    if (!voto) return;
    
    try {
      await atualizarVoto(voto.id, opcao);
    } catch (error) {
      console.error('Erro ao atualizar voto:', error);
    }
  };

  return (
    <div className="buscar-voto">
      <div className="card">
        <div className="card-titulo">Consultar ou Atualizar Voto</div>
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

          {erroAtualizacao && (
            <div className="error-message">
              {erroAtualizacao}
            </div>
          )}

          {voto && !mostrarOpcoes && (
            <div className="voto-detalhes">
              <h3>Detalhes do Voto #{voto.id}</h3>
              <p><strong>Associado:</strong> {voto.associadoNome} (ID: {voto.associadoId})</p>
              <p><strong>Pauta:</strong> {voto.pautaTitulo} (ID: {voto.pautaId})</p>
              <p><strong>Voto:</strong> <span className={`voto-opcao ${voto.opcao === OpcaoVoto.SIM ? 'sim' : 'nao'}`}>{voto.opcao}</span></p>
              <p><strong>Data/Hora:</strong> {new Date(voto.dataHora).toLocaleString()}</p>
              
              <div className="card-acoes">
                <button 
                  type="button" 
                  className="botao-secundario" 
                  onClick={handleLimpar}
                >
                  Consultar outro voto
                </button>
                <button 
                  type="button" 
                  className="botao-principal" 
                  onClick={handleTrocarVoto}
                >
                  Alterar meu voto
                </button>
              </div>
            </div>
          )}

          {voto && mostrarOpcoes && (
            <div className="voto-atualizar">
              <h3>Atualizar Voto #{voto.id}</h3>
              <p>Seu voto atual: <span className={`voto-opcao ${voto.opcao === OpcaoVoto.SIM ? 'sim' : 'nao'}`}>{voto.opcao}</span></p>
              <p>Escolha sua nova opção de voto:</p>
              
              <div className="voto-opcoes">
                <button 
                  type="button" 
                  className="botao-principal" 
                  style={{ backgroundColor: '#1bc47d', width: '100%' }}
                  onClick={() => handleAtualizarVoto(OpcaoVoto.SIM)}
                  disabled={atualizando}
                >
                  {atualizando ? 'Atualizando...' : 'SIM'}
                </button>
                
                <button 
                  type="button" 
                  className="botao-principal" 
                  style={{ backgroundColor: '#e74c3c', width: '100%' }}
                  onClick={() => handleAtualizarVoto(OpcaoVoto.NAO)}
                  disabled={atualizando}
                >
                  {atualizando ? 'Atualizando...' : 'NÃO'}
                </button>
              </div>
              
              <button 
                type="button" 
                className="botao-secundario" 
                onClick={() => setMostrarOpcoes(false)}
                style={{ marginTop: '16px' }}
                disabled={atualizando}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuscarVoto;