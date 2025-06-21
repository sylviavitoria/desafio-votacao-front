import useListarPautas from '../hooks/useListarPautas';
import useExcluirPauta from '../hooks/useExcluirPauta';
import ListarEntidade from './generic/ListarEntidade';
import { PautaResponse } from '../types/Pauta';
import { useNavigate } from 'react-router-dom';

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

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, { texto: string, classe: string }> = {
      'CRIADA': { texto: 'Criada', classe: 'status-info' },
      'EM_VOTACAO': { texto: 'Em Votação', classe: 'status-warning' },
      'ENCERRADA': { texto: 'Encerrada', classe: 'status-dark' },
      'APROVADA': { texto: 'Aprovada', classe: 'status-success' },
      'RECUSADA': { texto: 'Recusada', classe: 'status-danger' },
      'EMPATADA': { texto: 'Empatada', classe: 'status-secondary' }
    };
    
    return statusMap[status] || { texto: status, classe: '' };
  };

  const iniciarSessaoVotacao = (id: number) => {
    navigate(`/detalhe-votacao/${id}`);
  };

  const renderizarConteudoPauta = (pauta: PautaResponse) => {
    const statusInfo = getStatusLabel(pauta.status);

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
      renderizarConteudo={renderizarConteudoPauta}
    />
  );
}

export default ListarPautas;