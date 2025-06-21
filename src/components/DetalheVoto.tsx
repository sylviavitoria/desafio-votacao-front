import { useParams } from 'react-router-dom';
import useVotoDetalhes from '../hooks/useVotoDetalhes';
import Banner from './Banner';

const DetalheVoto = () => {
  const { id } = useParams<{ id: string }>();
  const votoId = id ? parseInt(id) : undefined;
  
  const {
    voto,
    carregando,
    erro
  } = useVotoDetalhes({ id: votoId });

  if (carregando) {
    return <p className="carregando">Carregando detalhes do voto...</p>;
  }

  if (erro) {
    return <div className="error-message">{erro}</div>;
  }

  if (!voto) {
    return <div className="error-message">Voto não encontrado</div>;
  }

  return (
    <>
      <Banner
        titulo="Detalhes do Voto"
        descricao="Informações detalhadas sobre o voto registrado"
      />
      <div className="content">
        <div className="card">
          <div className="card-titulo">Voto #{voto.id}</div>
          <div className="card-conteudo">
            <p><strong>Associado:</strong> {voto.associadoNome} (ID: {voto.associadoId})</p>
            <p><strong>Pauta:</strong> {voto.pautaTitulo} (ID: {voto.pautaId})</p>
            <p><strong>Voto:</strong> {voto.opcao}</p>
            <p><strong>Data/Hora:</strong> {new Date(voto.dataHora).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetalheVoto;