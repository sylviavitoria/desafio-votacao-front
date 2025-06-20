import { useNavigate } from 'react-router-dom';
import Card from '../Card';

interface ListarEntidadeProps<T> {
  titulo: string;
  entidades: T[];
  carregando: boolean;
  erro: string | null;
  pagina: number;
  totalPaginas: number;
  ultimaPagina: boolean;
  primeiraPagina: boolean;
  mudarPagina: (novaPagina: number) => void;
  excluir: (id: number) => Promise<boolean>;
  excluindo: boolean;
  erroExclusao: string | null;
  rotaEditarBase: string;
  getId: (item: T) => number;
  getTitulo: (item: T) => string;
  podeEditar: (item: T) => boolean;
  podeExcluir: (item: T) => boolean;
  renderizarConteudo: (item: T) => React.ReactNode;
}

function ListarEntidade<T>({
  titulo,
  entidades,
  carregando,
  erro,
  pagina,
  totalPaginas,
  ultimaPagina,
  primeiraPagina,
  mudarPagina,
  excluir,
  excluindo,
  erroExclusao,
  rotaEditarBase,
  getId,
  getTitulo,
  podeEditar,
  podeExcluir,
  renderizarConteudo
}: ListarEntidadeProps<T>) {
  const navigate = useNavigate();
  
  const handleExcluir = async (id: number) => {
    await excluir(id);
  };

  const handleEditar = (id: number) => {
    navigate(`/${rotaEditarBase}/${id}`);
  };

  if (carregando) {
    return <p className="carregando">Carregando dados...</p>;
  }

  return (
    <div className="listar-entidades">
      <h2>{titulo}</h2>
      
      {(erro || erroExclusao) && (
        <div className="error-message">
          {erro || erroExclusao}
        </div>
      )}
      
      {entidades.length === 0 ? (
        <p className="aviso-vazio">Nenhum registro encontrado.</p>
      ) : (
        <>
          <div className="cards-container">
            {entidades.map((entidade) => (
              <Card
                key={getId(entidade)}
                titulo={getTitulo(entidade)}
                onEdit={podeEditar(entidade) ? () => handleEditar(getId(entidade)) : undefined}
                onDelete={podeExcluir(entidade) ? () => !excluindo && handleExcluir(getId(entidade)) : undefined}
                clickToReveal={true}
              >
                {renderizarConteudo(entidade)}
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
              Página {pagina + 1} de {totalPaginas || 1}
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

export default ListarEntidade;