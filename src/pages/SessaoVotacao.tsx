import ListarSessoesVotacao from '../components/ListarSessoesVotacao';
import Banner from '../components/Banner';

const SessaoVotacao = () => {
  return (
    <>
      <Banner
        titulo="Sessões de Votação"
        descricao="Visualize todas as sessões de votação e seus resultados."
      />
      <div className="content full-width">
        <ListarSessoesVotacao titulo="Sessões de Votação" />
      </div>
    </>
  );
};

export default SessaoVotacao;