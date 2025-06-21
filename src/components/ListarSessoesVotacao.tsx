import { SessaoVotacaoResponse } from '../types/SessaoVotacao';
import useListarSessoesVotacao from '../hooks/useListarSessoesVotacao';
import useExcluirSessaoVotacao from '../hooks/useExcluirSessaoVotacao';
import ListarEntidade from './generic/ListarEntidade';

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

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, { texto: string, classe: string }> = {
      'AGENDADA': { texto: 'Agendada', classe: 'status-info' },
      'ABERTA': { texto: 'Em Votação', classe: 'status-warning' },
      'ENCERRADA': { texto: 'Encerrada', classe: 'status-dark' }
    };
    
    return statusMap[status] || { texto: status, classe: '' };
  };

  const renderizarConteudoSessao = (sessao: SessaoVotacaoResponse) => {
    const statusInfo = getStatusLabel(sessao.status);

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