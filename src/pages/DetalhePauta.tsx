import { useParams } from 'react-router-dom';
import { useState } from 'react';
import usePautaDetalhes from '../hooks/usePautaDetalhes';
import CriarSessaoVotacao from '../components/CriarSessaoVotacao';
import Banner from '../components/Banner';

const DetalhePauta = () => {
  const { id } = useParams<{ id: string }>();
  const pautaId = id ? parseInt(id) : undefined;
  const [mostrarFormSessao, setMostrarFormSessao] = useState(false);

  const {
    pauta,
    carregando,
    erro
  } = usePautaDetalhes({ id: pautaId });

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

  const handleIniciarSessao = () => {
    setMostrarFormSessao(true);
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
          </div>
          
          {podeIniciarVotacao && !mostrarFormSessao && (
            <div className="card-acoes">
              <button 
                className="botao-principal"
                onClick={handleIniciarSessao}
              >
                Iniciar Sessão de Votação
              </button>
            </div>
          )}
        </div>

        {mostrarFormSessao && (
          <CriarSessaoVotacao 
            pautaId={pautaId} 
            onSuccess={() => {
              window.location.reload();
            }} 
          />
        )}
      </div>
    </>
  );
};

export default DetalhePauta;