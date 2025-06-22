import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import usePautaDetalhes from '../hooks/usePautaDetalhes';
import CriarSessaoVotacao from '../components/CriarSessaoVotacao';
import RegistrarVoto from '../components/RegistrarVoto';
import Banner from '../components/Banner';

const DetalhePauta = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const pautaId = id ? parseInt(id) : undefined;
  const [mostrarFormSessao, setMostrarFormSessao] = useState(false);
  const [mostrarFormVoto, setMostrarFormVoto] = useState(false);

  const {
    pauta,
    carregando,
    erro,
    carregarPauta
  } = usePautaDetalhes({ id: pautaId });

  useEffect(() => {
    const deveVotar = searchParams.get('votar') === 'true';
    if (deveVotar) {
      setMostrarFormVoto(true);
    }
  }, [searchParams]);

  if (carregando) {
    return <p className="carregando">Carregando dados da pauta...</p>;
  }

  if (erro) {
    return <div className="error-message">{erro}</div>;
  }

  if (!pauta) {
    return <div className="error-message">Pauta não encontrada</div>;
  }

  const podeIniciarVotacao = pauta.status === 'CRIADA';
  const podeVotar = pauta.status === 'EM_VOTACAO';

  const handleIniciarSessao = () => {
    setMostrarFormSessao(true);
    setMostrarFormVoto(false);
  };

  const handleVotar = () => {
    setMostrarFormVoto(true);
    setMostrarFormSessao(false);
  };

  const handleVoltar = () => {
    navigate('/listar-pautas');
  };

  return (
    <>
      <Banner
        titulo={pauta.titulo}
        descricao="Detalhes da pauta e gerenciamento de votação"
      />
      <div className="content">
        <div className="card">
          <div className="card-titulo">Detalhes da Pauta</div>
          <div className="card-conteudo">
            <p><strong>Descrição:</strong> {pauta.descricao}</p>
            <p><strong>Criador:</strong> {pauta.criador.nome}</p>
            <p><strong>Status:</strong> <span className={`pauta-status status-${pauta.status.toLowerCase()}`}>{pauta.status}</span></p>

            {pauta.status === 'APROVADA' || pauta.status === 'RECUSADA' || pauta.status === 'EMPATADA' ? (
              <div className="pauta-resultado">
                <p><strong>Resultado:</strong></p>
                <div className="votos-container">
                  <div className="voto-item">
                    <span className="voto-label">Sim:</span>
                    <span className="voto-count sim">{pauta.totalVotosSim}</span>
                  </div>
                  <div className="voto-item">
                    <span className="voto-label">Não:</span>
                    <span className="voto-count nao">{pauta.totalVotosNao}</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          
          <div className="card-acoes">
            <button 
              className="botao-secundario"
              onClick={handleVoltar}
            >
              Voltar para Listagem
            </button>
            
            {podeIniciarVotacao && !mostrarFormSessao && !mostrarFormVoto && (
              <button 
                className="botao-principal"
                onClick={handleIniciarSessao}
              >
                Iniciar Sessão de Votação
              </button>
            )}
            {podeVotar && !mostrarFormVoto && !mostrarFormSessao && (
              <button 
                className="botao-principal"
                onClick={handleVotar}
                style={{ backgroundColor: '#1bc47d' }}
              >
                Votar
              </button>
            )}
          </div>
        </div>

        {mostrarFormSessao && (
          <CriarSessaoVotacao 
            pautaId={pautaId} 
            onSuccess={() => {
              window.location.reload();
            }} 
          />
        )}

        {mostrarFormVoto && podeVotar && (
          <RegistrarVoto 
            pautaId={pautaId!} 
            onVotoRegistrado={() => {
              carregarPauta(pautaId);
              setMostrarFormVoto(false);
            }} 
          />
        )}
      </div>
    </>
  );
};

export default DetalhePauta;