import Banner from '../components/Banner';
import ListarPautas from '../components/ListarPautas';

const Home = () => {
  return (
    <>
      <Banner 
        titulo="Bem-vindo ao VotaFácil!" 
        descricao="Confira todas as pautas disponíveis para votação"
      />
      <div className="content full-width">
        <ListarPautas titulo="Todas as Pautas" />
      </div>
    </>
  );
};

export default Home;