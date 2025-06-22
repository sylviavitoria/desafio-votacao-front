import useListarAssociados from '../hooks/useListarAssociados';
import useExcluirAssociado from '../hooks/useExcluirAssociado';
import ListarEntidade from './generic/ListarEntidade';
import { Associado } from '../types/Associado';

function ListarAssociados() {
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

  const renderizarConteudoAssociado = (associado: Associado) => {
    return (
      <>
        <p><strong>Email:</strong> {associado.email}</p>
        <p><strong>ID:</strong> {associado.id}</p>
      </>
    );
  };

  return (
    <ListarEntidade
      titulo="Lista de Associados"
      entidades={associados}
      carregando={carregando}
      erro={erro}
      pagina={pagina}
      totalPaginas={totalPaginas}
      ultimaPagina={ultimaPagina}
      primeiraPagina={primeiraPagina}
      mudarPagina={mudarPagina}
      excluir={excluirAssociado}
      excluindo={excluindo}
      erroExclusao={erroExclusao}
      rotaEditarBase="editar-associado"
      getId={(associado) => associado.id!}
      getTitulo={(associado) => associado.nome}
      podeEditar={() => true}
      podeExcluir={() => true}
      renderizarConteudo={renderizarConteudoAssociado}
    />
  );
}

export default ListarAssociados;