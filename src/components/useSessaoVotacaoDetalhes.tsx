import { useParams } from 'react-router-dom';
import { useState } from 'react';
import useSessaoVotacaoDetalhes from '../hooks/useSessaoVotacaoDetalhes';
import AtualizarPeriodoSessao from '../components/AtualizarPeriodoSessao';
import Banner from '../components/Banner';

const DetalheSessao = () => {
  const { id } = useParams<{ id: string }>();
  const sessaoId = id ? parseInt(id) : undefined;
  const [mostrarFormAtualizacao, setMostrarFormAtualizacao] = useState(false);
  
  const {
    sessao,
    carregando,
    erro,
    carregarSessao
  } = useSessaoVotacaoDetalhes({ id: sessaoId });

  if (carregando) {
    return <p className="carregando">Carregando dados da sessão...</p>;
  }

  if (erro) {
    return <div className="error-message">{erro}</div>;
  }

  if (!sessao) {
    return <div className="error-message">Sessão não encontrada</div>;
  }

  const podeEstenderSessao = sessao.status === 'ABERTA';

  const handleEstenderSessao = () => {
    setMostrarFormAtualizacao(true);
  };

  return (
    <>
      <Banner
        titulo={`Sessão de Votação: ${sessao.pautaTitulo}`}
        descricao="Detalhes da sessão de votação"
      />
      <div className="content">
        <div className="card">
          <div className="card-titulo">Detalhes da Sessão</div>
          <div className="card-conteudo">
            <p><strong>ID:</strong> {sessao.id}</p>
            <p><strong>Pauta:</strong> {sessao.pautaTitulo}</p>
            <p><strong>Data de Abertura:</strong> {new Date(sessao.dataAbertura).toLocaleString()}</p>
            <p><strong>Data de Fechamento:</strong> {new Date(sessao.dataFechamento).toLocaleString()}</p>
            <p><strong>Status:</strong> {sessao.status}</p>
          </div>
          
          {podeEstenderSessao && !mostrarFormAtualizacao && (
            <div className="card-acoes">
              <button 
                className="botao-principal"
                onClick={handleEstenderSessao}
              >
                Estender Período da Votação
              </button>
            </div>
          )}
        </div>

        {mostrarFormAtualizacao && (
          <AtualizarPeriodoSessao 
            sessaoId={sessaoId!} 
            onSuccess={() => {
              setMostrarFormAtualizacao(false);
              carregarSessao(sessaoId);
            }}
          />
        )}
      </div>
    </>
  );
};

export default DetalheSessao;