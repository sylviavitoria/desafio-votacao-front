import { useNavigate } from 'react-router-dom';
import useListarPautas from '../hooks/useListarPautas';
import useExcluirPauta from '../hooks/useExcluirPauta';
import Card from './Card';

function ListarPautas() {
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

  const handleExcluir = async (id: number) => {
    await excluirPauta(id);
  };

  const handleEditar = (id: number) => {
    navigate(`/editar-pauta/${id}`);
  };

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

  if (carregando) {
    return <p className="carregando">Carregando pautas...</p>;
  }

  return (
    <div className="listar-pautas">
      <h2>Lista de Pautas</h2>
      
      {(erro || erroExclusao) && (
        <div className="error-message">
          {erro || erroExclusao}
        </div>
      )}
      
      {pautas.length === 0 ? (
        <p className="aviso-vazio">Nenhuma pauta encontrada.</p>
      ) : (
        <>
          <div className="cards-container">
            {pautas.map((pauta) => {
              const statusInfo = getStatusLabel(pauta.status);
              
              return (
                <Card
                  key={pauta.id}
                  titulo={pauta.titulo}
                  onEdit={() => pauta.status === 'CRIADA' && handleEditar(pauta.id)}
                  onDelete={() => pauta.status === 'CRIADA' && !excluindo && handleExcluir(pauta.id)}
                  clickToReveal={true}
                >
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
                </Card>
              );
            })}
          </div>

          <div className="paginacao">
            <button 
              onClick={() => mudarPagina(pagina - 1)}
              disabled={carregando || primeiraPagina}
              className="botao-secundario"
            >
              Anterior
            </button>
            <span>
              Página {pagina + 1} de {totalPaginas}
            </span>
            <button 
              onClick={() => mudarPagina(pagina + 1)}
              disabled={carregando || ultimaPagina}
              className="botao-secundario"
            >
              Próxima
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ListarPautas;