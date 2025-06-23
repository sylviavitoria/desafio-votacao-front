import Banner from '../components/Banner';
import ListarPautas from '../components/ListarPautas';

const Home = () => {
  return (
    <>
      <Banner
        titulo="Bem-vindo ao VotaFácil!"
        descricao="Acompanhe, participe e exerça seu direito de voto de forma simples, rápida e segura. Confira abaixo todas as pautas nas assembleias e contribua para as tomadas de decisão."
      />
      <div className="content full-width">
        <ListarPautas titulo="Todas as Pautas" />
      </div>
    </>
  );
};

export default Home;