import { useState } from 'react';
import CriarAssociado from '../components/CriarAssociado';
import ListarAssociados from '../components/ListarAssociados';
import Banner from '../components/Banner';

const Associado = () => {
  const [modo, setModo] = useState<'listar' | 'criar'>('listar');

  return (
    <>
      <Banner
        titulo="Associados"
        descricao="Gerencie seus associados. Cadastre, edite e acompanhe facilmente todos os registros."
      />
      <div className="content full-width">
        <div className="botao-container">
          {modo === 'listar' ? (
            <button
              className="botao-principal"
              onClick={() => setModo('criar')}
            >
              Cadastrar Novo Associado
            </button>
          ) : (
            <button
              className="botao-secundario"
              onClick={() => setModo('listar')}
            >
              Voltar para Listagem
            </button>
          )}
        </div>
        
        {modo === 'listar' ? <ListarAssociados /> : <CriarAssociado />}
      </div>
    </>
  );
};

export default Associado;