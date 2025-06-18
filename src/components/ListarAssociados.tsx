import { useNavigate } from 'react-router-dom';
import useListarAssociados from '../hooks/useListarAssociados';
import useExcluirAssociado from '../hooks/useExcluirAssociado';
import Card from './Card';

function ListarAssociados() {
  const navigate = useNavigate();
  
  const { 
    associados, 
    carregando, 
    erro, 
    pagina, 
    totalPaginas, 
    ultimaPagina, 
    primeiraPagina,
    mudarPagina,
    carregarAssociados
  } = useListarAssociados();
  
  const { 
    excluirAssociado, 
    excluindo, 
    erro: erroExclusao 
  } = useExcluirAssociado({
    onSuccess: () => {
      carregarAssociados(); 
    }
  });

  const handleExcluir = async (id: number) => {
    await excluirAssociado(id);
  };

  const handleEditar = (id: number) => {
    navigate(`/editar-associado/${id}`);
  };

  if (carregando) {
    return <p className="carregando">Carregando associados...</p>;
  }

  return (
    <div className="listar-associados">
      <h2>Lista de Associados</h2>
      
      {(erro || erroExclusao) && (
        <div className="error-message">
          {erro || erroExclusao}
        </div>
      )}
      
      {associados.length === 0 ? (
        <p className="aviso-vazio">Nenhum associado encontrado.</p>
      ) : (
        <>
          <div className="cards-container">
            {associados.map((associado) => (
              <Card
                key={associado.id}
                titulo={associado.nome}
                onEdit={() => handleEditar(associado.id!)}
                onDelete={() => !excluindo && handleExcluir(associado.id!)}
                clickToReveal={true} 
              >
                <p><strong>Email:</strong> {associado.email}</p>
                {/* <p><strong>CPF:</strong> {associado.cpf}</p> */}
                {/* <p><strong>ID:</strong> {associado.id}</p> */}
              </Card>
            ))}
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

export default ListarAssociados;