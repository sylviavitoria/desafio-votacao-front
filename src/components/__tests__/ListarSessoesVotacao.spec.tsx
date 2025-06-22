import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import ListarSessoesVotacao from '../ListarSessoesVotacao';
import useListarSessoesVotacao from '../../hooks/useListarSessoesVotacao';
import useExcluirSessaoVotacao from '../../hooks/useExcluirSessaoVotacao';

jest.mock('../../hooks/useListarSessoesVotacao');
jest.mock('../../hooks/useExcluirSessaoVotacao');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

jest.mock('../generic/ListarEntidade', () => {
  return {
    __esModule: true,
    default: ({
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
    }) => (
      <div data-testid="listar-entidade-mock">
        <h2>{titulo}</h2>
        <div data-testid="entidades-count">{entidades.length}</div>
        <div data-testid="carregando">{carregando.toString()}</div>
        <div data-testid="erro">{erro || ''}</div>
        <div data-testid="pagina">{pagina}</div>
        <div data-testid="total-paginas">{totalPaginas}</div>
        <div data-testid="ultima-pagina">{ultimaPagina.toString()}</div>
        <div data-testid="primeira-pagina">{primeiraPagina.toString()}</div>
        
        <button 
          data-testid="mudar-pagina-btn" 
          onClick={() => mudarPagina(pagina + 1)}
        >
          Próxima Página
        </button>
        
        <button 
          data-testid="excluir-btn" 
          onClick={() => excluir(1)}
        >
          Excluir
        </button>
        
        <div data-testid="excluindo">{excluindo.toString()}</div>
        <div data-testid="erro-exclusao">{erroExclusao || ''}</div>
        <div data-testid="rota-editar">{rotaEditarBase}</div>
        
        {entidades.map(entidade => (
          <div key={getId(entidade)} data-testid="entidade-item">
            <h3>{getTitulo(entidade)}</h3>
            <div>{podeEditar(entidade) ? 'Pode Editar' : 'Não Pode Editar'}</div>
            <div>{podeExcluir(entidade) ? 'Pode Excluir' : 'Não Pode Excluir'}</div>
            <div data-testid="conteudo-renderizado">{renderizarConteudo(entidade)}</div>
          </div>
        ))}
      </div>
    )
  };
});

describe('ListarSessoesVotacao', () => {
  const navigateMock = jest.fn();
  const carregarSessoesMock = jest.fn();
  const excluirSessaoMock = jest.fn();
  
  const mockSessoes = [
    { 
      id: 1, 
      pautaId: 1, 
      pautaTitulo: 'Pauta 1', 
      dataAbertura: '2025-05-01T10:00:00',
      dataFechamento: '2025-05-01T11:00:00',
      status: 'ABERTA',
      abertaParaVotacao: true
    },
    { 
      id: 2, 
      pautaId: 2, 
      pautaTitulo: 'Pauta 2', 
      dataAbertura: '2025-05-02T10:00:00',
      dataFechamento: '2025-05-02T11:00:00',
      status: 'FINALIZADA',
      abertaParaVotacao: false
    },
    { 
      id: 3, 
      pautaId: 3, 
      pautaTitulo: 'Pauta 3', 
      dataAbertura: '2025-05-03T10:00:00',
      dataFechamento: '2025-05-03T11:00:00',
      status: 'FECHADA',
      abertaParaVotacao: false
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);

    (useListarSessoesVotacao as jest.Mock).mockReturnValue({
      sessoes: mockSessoes,
      carregando: false,
      erro: null,
      pagina: 0,
      totalPaginas: 1,
      ultimaPagina: true,
      primeiraPagina: true,
      carregarSessoes: carregarSessoesMock,
      mudarPagina: jest.fn()
    });

    (useExcluirSessaoVotacao as jest.Mock).mockReturnValue({
      excluirSessao: excluirSessaoMock,
      excluindo: false,
      erro: null
    });
  });

  it('deve renderizar o componente corretamente', () => {
    render(<ListarSessoesVotacao />);
    
    expect(screen.getByTestId('listar-entidade-mock')).toBeInTheDocument();
    expect(screen.getByText('Sessões de Votação')).toBeInTheDocument();
  });

  it('deve passar as sessões para o ListarEntidade', () => {
    render(<ListarSessoesVotacao />);
    
    expect(screen.getByTestId('entidades-count').textContent).toBe('3');
    expect(screen.getAllByTestId('entidade-item').length).toBe(3);
  });

  it('deve passar as props corretas para o ListarEntidade', () => {
    render(<ListarSessoesVotacao />);
    
    expect(screen.getByTestId('carregando').textContent).toBe('false');
    expect(screen.getByTestId('erro').textContent).toBe('');
    expect(screen.getByTestId('pagina').textContent).toBe('0');
    expect(screen.getByTestId('total-paginas').textContent).toBe('1');
    expect(screen.getByTestId('ultima-pagina').textContent).toBe('true');
    expect(screen.getByTestId('primeira-pagina').textContent).toBe('true');
    expect(screen.getByTestId('rota-editar').textContent).toBe('atualizar-sessao');
  });

  it('deve chamar a função de exclusão quando o botão excluir é clicado', () => {
    render(<ListarSessoesVotacao />);
    
    fireEvent.click(screen.getByTestId('excluir-btn'));
    expect(excluirSessaoMock).toHaveBeenCalledWith(1);
  });

  it('deve renderizar o conteúdo da sessão corretamente com o status apropriado', () => {
    render(<ListarSessoesVotacao />);
    
    const entidadeItems = screen.getAllByTestId('entidade-item');
    const conteudosRenderizados = screen.getAllByTestId('conteudo-renderizado');
    
    expect(entidadeItems[0]).toHaveTextContent('Pode Editar');
    expect(conteudosRenderizados[0]).toHaveTextContent('Aberta');
    
    expect(entidadeItems[1]).toHaveTextContent('Não Pode Editar');
    expect(conteudosRenderizados[1]).toHaveTextContent('Finalizada');
    
    expect(entidadeItems[2]).toHaveTextContent('Não Pode Editar');
    expect(conteudosRenderizados[2]).toHaveTextContent('Fechada');
  });

  it('deve mostrar o título da sessão com o formato correto', () => {
    render(<ListarSessoesVotacao />);
    
    const entidadeItems = screen.getAllByTestId('entidade-item');
    expect(entidadeItems[0]).toHaveTextContent('Sessão #1 - Pauta 1');
    expect(entidadeItems[1]).toHaveTextContent('Sessão #2 - Pauta 2');
    expect(entidadeItems[2]).toHaveTextContent('Sessão #3 - Pauta 3');
  });

  it('deve mostrar mensagem de carregamento quando estiver buscando dados', () => {
    (useListarSessoesVotacao as jest.Mock).mockReturnValue({
      sessoes: [],
      carregando: true,
      erro: null,
      pagina: 0,
      totalPaginas: 0,
      ultimaPagina: true,
      primeiraPagina: true,
      carregarSessoes: carregarSessoesMock,
      mudarPagina: jest.fn()
    });

    render(<ListarSessoesVotacao />);
    expect(screen.getByTestId('carregando').textContent).toBe('true');
  });

  it('deve chamar carregarSessoes quando o componente for renderizado', () => {
    render(<ListarSessoesVotacao />);
    
    expect(useListarSessoesVotacao).toHaveBeenCalled();
  });

  it('deve chamar carregarSessoes após uma exclusão bem-sucedida', () => {
    render(<ListarSessoesVotacao />);
    
    const onSuccessCallback = (useExcluirSessaoVotacao as jest.Mock).mock.calls[0][0].onSuccess;
    
    onSuccessCallback();
    
    expect(carregarSessoesMock).toHaveBeenCalled();
  });

  it('deve aceitar um título personalizado', () => {
    render(<ListarSessoesVotacao titulo="Título Personalizado" />);
    
    expect(screen.getByText('Título Personalizado')).toBeInTheDocument();
  });

  it('deve renderizar informações sobre datas e abertura para votação', () => {
    render(<ListarSessoesVotacao />);
    
    const conteudosRenderizados = screen.getAllByTestId('conteudo-renderizado');
    
    expect(conteudosRenderizados[0]).toHaveTextContent('Pauta:');
    expect(conteudosRenderizados[0]).toHaveTextContent('Pauta 1');
    
    expect(conteudosRenderizados[0]).toHaveTextContent('Data de Abertura:');
    expect(conteudosRenderizados[0]).toHaveTextContent('Data de Fechamento:');
    
    expect(conteudosRenderizados[0]).toHaveTextContent('Aberta para Votação:');
    expect(conteudosRenderizados[0]).toHaveTextContent('Sim');
    expect(conteudosRenderizados[1]).toHaveTextContent('Não');
  });
});