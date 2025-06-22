import Banner from '../components/Banner';
import BuscarVoto from '../components/BuscarVoto';
import BuscarResultado from '../components/BuscarResultado';

const Voto = () => {
  return (
    <>
      <Banner
        titulo="Consultas de Votação"
        descricao="Visualize detalhes sobre votos individuais, atualize seu voto e consulte resultados de pautas."
      />
      <div className="content">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <BuscarVoto />
          <BuscarResultado />
        </div>
      </div>
    </>
  );
};

export default Voto;