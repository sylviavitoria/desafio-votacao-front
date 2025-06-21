import { useParams } from 'react-router-dom';
import useSessaoVotacaoDetalhes from '../hooks/useSessaoVotacaoDetalhes';
import AtualizarPeriodoSessao from '../components/AtualizarPeriodoSessao';
import Banner from '../components/Banner';

const AtualizarSessaoVotacao = () => {
  const { id } = useParams<{ id: string }>();
  const sessaoId = id ? parseInt(id) : undefined;
  
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

  return (
    <>
      <Banner
        titulo={`Sessão de Votação: ${sessao.pautaTitulo}`}
        descricao="Atualização do período da sessão de votação"
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
        </div>

        {podeEstenderSessao && (
          <AtualizarPeriodoSessao 
            sessaoId={sessaoId!} 
            onSuccess={() => {
              carregarSessao(sessaoId);
            }}
          />
        )}

        {!podeEstenderSessao && (
          <div className="card">
            <div className="card-titulo">Aviso</div>
            <div className="card-conteudo">
              <p>Esta sessão não pode ser alterada pois não está mais no status ABERTA.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AtualizarSessaoVotacao;