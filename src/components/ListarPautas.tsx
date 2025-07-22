import useListarPautas from '../hooks/useListarPautas';
import useExcluirPauta from '../hooks/useExcluirPauta';
import ListarEntidade from './generic/ListarEntidade';
import { PautaResponse } from '../types/Pauta';
import { useNavigate } from 'react-router-dom';
import { formatarData, getStatusPauta } from '../utils/formatacao';

function ListarPautas({ titulo = "Lista de Pautas" }) {
  const navigate = useNavigate();
  const {
    pautas,
    carregando,
    erro,
    pagina,
    totalPaginas,
    ultimaPagina,
    primeiraPagina,
    mudarPagina,
    carregarPautas
  } = useListarPautas();

  const {
    excluirPauta,
    excluindo,
    erro: erroExclusao
  } = useExcluirPauta({
    onSuccess: () => {
      carregarPautas();
    }
  });

  const iniciarSessaoVotacao = (id: number) => {
    navigate(`/detalhe-votacao/${id}`);
  };
  
  const votar = (id: number) => {
    navigate(`/detalhe-votacao/${id}?votar=true`);
  };

  const renderizarConteudoPauta = (pauta: PautaResponse) => {
    const statusInfo = getStatusPauta(pauta.status);

    return (
      <>
        <div>
          <div className={`pauta-status ${statusInfo.classe}`}>
            {statusInfo.texto}
          </div>

          <p className="pauta-descricao">{pauta.descricao}</p>

          <div className="pauta-meta">
            <p><strong>Criado por:</strong> {pauta.criador.nome}</p>
            <p><strong>Data de criação:</strong> {formatarData(pauta.dataCriacao)}</p>

            {(pauta.status === 'APROVADA' || pauta.status === 'RECUSADA' || pauta.status === 'EMPATADA') && (
              <div className="pauta-resultado">
                <p><strong>Resultado:</strong></p>
                <div className="votos-container">
                  <div className="voto-item">
                    <span className="voto-label">Sim:</span>
                    <span className="voto-count sim">{pauta.totalVotosSim}</span>
                  </div>
                  <div className="voto-item">
                    <span className="voto-label">Não:</span>
                    <span className="voto-count nao">{pauta.totalVotosNao}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <ListarEntidade
      titulo={titulo}
      entidades={pautas}
      carregando={carregando}
      erro={erro}
      pagina={pagina}
      totalPaginas={totalPaginas}
      ultimaPagina={ultimaPagina}
      primeiraPagina={primeiraPagina}
      mudarPagina={mudarPagina}
      excluir={excluirPauta}
      excluindo={excluindo}
      erroExclusao={erroExclusao}
      rotaEditarBase="editar-pauta"
      getId={(pauta) => pauta.id}
      getTitulo={(pauta) => pauta.titulo}
      podeEditar={(pauta) => pauta.status === 'CRIADA'}
      podeExcluir={(pauta) => pauta.status === 'CRIADA'}
      podeIniciarSessao={(pauta) => pauta.status === 'CRIADA'}
      onIniciarSessao={iniciarSessaoVotacao}
      podeVotar={(pauta) => pauta.status === 'EM_VOTACAO'} 
      onVotar={votar} 
      renderizarConteudo={renderizarConteudoPauta}
    />
  );
}

export default ListarPautas;