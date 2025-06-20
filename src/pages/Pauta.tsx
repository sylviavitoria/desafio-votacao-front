import { useState } from 'react';
import CriarPauta from '../components/CriarPauta';
import ListarPautas from '../components/ListarPautas';
import Banner from '../components/Banner';

const Pauta = () => {
  const [modo, setModo] = useState<'listar' | 'criar'>('listar');

  return (
    <>
      <Banner
        titulo="Pautas de Votação"
        descricao="Gerencie as pautas para votação. Crie novas pautas e acompanhe os resultados."
      />
      <div className="content full-width">
        <div className="botao-container">
          {modo === 'listar' ? (
            <button
              className="botao-principal"
              onClick={() => setModo('criar')}
            >
              Cadastrar Nova Pauta
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
        
        {modo === 'listar' ? <ListarPautas /> : <CriarPauta />}
      </div>
    </>
  );
};

export default Pauta;