import { SessaoVotacaoResponse } from '../types/SessaoVotacao';
import useListarSessoesVotacao from '../hooks/useListarSessoesVotacao';
import useExcluirSessaoVotacao from '../hooks/useExcluirSessaoVotacao';
import ListarEntidade from './generic/ListarEntidade';
import { formatarData, getStatusSessao } from '../utils/formatacao';

function ListarSessoesVotacao({ titulo = "Sessões de Votação" }) {
  const {
    sessoes,
    carregando,
    erro,
    pagina,
    totalPaginas,
    ultimaPagina,
    primeiraPagina,
    mudarPagina,
    carregarSessoes
  } = useListarSessoesVotacao();

  const {
    excluirSessao,
    excluindo,
    erro: erroExclusao
  } = useExcluirSessaoVotacao({
    onSuccess: () => {
      carregarSessoes();
    }
  });

  const renderizarConteudoSessao = (sessao: SessaoVotacaoResponse) => {
    const statusInfo = getStatusSessao(sessao.status);

    return (
      <>
        <div>
          <div className={`pauta-status ${statusInfo.classe}`}>
            {statusInfo.texto}
          </div>

          <p><strong>Pauta:</strong> {sessao.pautaTitulo}</p>

          <div className="pauta-meta">
            <p><strong>Data de Abertura:</strong> {formatarData(sessao.dataAbertura)}</p>
            <p><strong>Data de Fechamento:</strong> {formatarData(sessao.dataFechamento)}</p>
            <p><strong>Aberta para Votação:</strong> {sessao.abertaParaVotacao ? 'Sim' : 'Não'}</p>
          </div>
        </div>
      </>
    );
  };

  return (
    <ListarEntidade
      titulo={titulo}
      entidades={sessoes}
      carregando={carregando}
      erro={erro}
      pagina={pagina}
      totalPaginas={totalPaginas}
      ultimaPagina={ultimaPagina}
      primeiraPagina={primeiraPagina}
      mudarPagina={mudarPagina}
      excluir={excluirSessao}
      excluindo={excluindo}
      erroExclusao={erroExclusao}
      rotaEditarBase="atualizar-sessao"
      getId={(sessao) => sessao.id}
      getTitulo={(sessao) => `Sessão #${sessao.id} - ${sessao.pautaTitulo}`}
      podeEditar={(sessao) => sessao.status === 'ABERTA'}
      podeExcluir={() => false}
      renderizarConteudo={renderizarConteudoSessao}
    />
  );
}

export default ListarSessoesVotacao;