import { useState } from 'react';
import CriarAssociado from '../components/CriarAssociado';
import Banner from '../components/Banner';

const Associado = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  return (
    <>
      {!mostrarFormulario ? (
        <>
          <Banner
            titulo="Associados"
            descricao="Gerencie seus associados. Cadastre, edite e acompanhe facilmente todos os registros."
          />
          <div className="content full-width">
            <div className="botao-container">
              <button
                className="botao-principal"
                onClick={() => setMostrarFormulario(true)}
              >
                Cadastrar Novo Associado
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="content full-width">
          <CriarAssociado />
          <div className="botao-container">
            <button
              className="botao-secundario"
              onClick={() => setMostrarFormulario(false)}
            >
              Voltar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Associado;