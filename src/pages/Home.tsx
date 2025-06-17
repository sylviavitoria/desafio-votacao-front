import Banner from './../components/Banner';

const Home = () => {
  return (
    <>
      <Banner 
        titulo="Bem-vindo ao VotaFácil!" 
        descricao="Você faz votações de suas pautas aqui!"
      />
      <div className="content">
        {/*As pautas serão cadastradas aqui */}
        <h3>Conteúdo do site em construção...</h3>
      </div>
    </>
  );
};

export default Home;